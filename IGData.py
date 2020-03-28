import json
import re
import os
import traceback
from random import random
from collections import deque
from multiprocessing import Pool
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

login, password = None, None
pool_size = 8
visible = False
drivers = []

top_100_tags = ['love', 'instagood', 'photooftheday', 'fashion', 'Beautiful', 'like4like', 'picoftheday', 'art', 'happy', 'photography', 'instagram', 'followme', 'style', 'follow', 'instadaily', 'travel', 'life', 'cute', 'fitness', 'nature', 'beauty', 'girl', 'fun', 'photo', 'amazing', 'likeforlike', 'instalike', 'Selfie', 'smile', 'me', 'lifestyle', 'model', 'follow4follow', 'music', 'friends', 'motivation', 'like', 'food', 'inspiration', 'Repost', 'summer', 'design', 'makeup', 'TBT', 'followforfollow', 'ootd', 'Family', 'l4l', 'cool', 'igers', 'TagsForLikes', 'hair', 'instamood', 'sun', 'vsco', 'fit', 'beach', 'photographer', 'gym', 'artist', 'girls', 'vscocam', 'autumn', 'pretty', 'luxury', 'instapic', 'black', 'sunset', 'funny', 'sky', 'blogger', 'hot', 'healthy', 'work', 'bestoftheday', 'workout', 'f4f', 'nofilter', 'london', 'goals', 'blackandwhite', 'blue', 'swag', 'health', 'party', 'night', 'landscape', 'nyc', 'happiness', 'pink', 'lol', 'foodporn', 'newyork', 'fitfam', 'awesome', 'fashionblogger', 'Halloween', 'Home', 'fall', 'paris']
"""top 100 hashtags from https://www.all-hashtag.com/top-hashtags.php, used as a starting point
for create_dataset
"""

def create_dataset(total=100, output_path='dataset.json'):
    """Creates dataset of posts consisting of image links and the hashtags they use.

    Writes output to JSON file. Used for training the image similarity model.

    Parameters:
    output_path -- path of JSON output file
    total -- number of hashtags to collect data from
    """
    if len(drivers) == 0:
        initialize_drivers()

    dataset = _scrape(top_100_tags[:total], _scrape_post_tags, total)

    dataset_formatted = _format_dataset(dataset)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dataset_formatted, f, ensure_ascii=False)


#TODO: handle case when user has no past hashtags
def rank_tags(username, image, total=100, num_starting=30):
    """Rank hashtags for a user."""

    if login is None or password is None:
        raise Exception('Missing login and password.')
    if len(drivers) == 0:
        initialize_drivers()

    seen_tags = _scrape(_get_user_tags(username, num_starting), _scrape_post_engagement, total)

    tag_scores = {}
    for tag in seen_tags:
        # skip failed tags
        if seen_tags[tag] is None:
            continue
        weighted_diffs = []
        for post in seen_tags[tag]:
            # skip failed posts
            if post is None:
                continue
            img_link, engagement_diff = post[0], post[1]
            weighted_diffs.append(_similarity(image, img_link) * engagement_diff)
        tag_scores[tag] = sum(weighted_diffs) / len(weighted_diffs)

    return tag_scores


def initialize_drivers():
    """Initialize selenium webdrivers. Calling beforehand can save time later."""
    print('Initializing webdrivers for scraping')
    global drivers
    driver_options = Options()
    if not visible:
        driver_options.add_argument('--headless')
    drivers = [Chrome('./chromedriver', options=driver_options) for _ in range(pool_size)]


def quit_drivers():
    """Quits selenium webdrivers. Call before exiting program to avoid memory leaks."""
    [driver.quit() for driver in drivers]


def _scrape(starting_tags, post_scraper, total):
    tag_Q = deque(starting_tags)
    seen_tags = dict.fromkeys(tag_Q)

    while len(tag_Q) > 0:
        curr_tags = [tag_Q.popleft() for _ in range(min(pool_size, len(tag_Q)))]
        print(f'Currently scraping: {curr_tags}')

        pool = Pool(len(curr_tags))
        args = [[curr_tags[i], post_scraper, i] for i in range(len(curr_tags))]
        results = pool.starmap(_scrape_tag, args)
        pool.close()
        pool.join()

        # parsing results
        for i in range(len(results)):
            # if call to _scrape_tag failed, skip that result
            if results[i] is None:
                continue
            image_engagements, related_tags = results[i][0], results[i][1]

            seen_tags[curr_tags[i]] = image_engagements
            for tag in related_tags:
                if len(seen_tags) >= total:
                    break
                if tag not in seen_tags:
                    tag_Q.append(tag)
                    seen_tags[tag] = None

    return seen_tags


def _get_user_tags(username, num_tags=15, driver_index=0):
    driver = drivers[driver_index]
    user_json = _get_user(username, driver)
    user_posts = user_json['graphql']['user']['edge_owner_to_timeline_media']['edges']

    user_tags = set()
    for post in user_posts:
        caption = post['node']['edge_media_to_caption']['edges'][0]['node']['text']

        # lazily iterating through tags
        for match in re.finditer(r'\#\w+', caption):
            tag = match.group(0)[1:]
            user_tags.add(tag)
            if len(user_tags) == num_tags:
                return user_tags

    return user_tags


def _get_user(username, driver):
    driver.get(f'https://www.instagram.com/{username}/?__a=1')

    # logging in if needed
    if driver.page_source[:19] != '<html><head></head>':
        inputs = WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'input'))
        )
        inputs = driver.find_elements_by_css_selector('input')
        button = driver.find_element_by_css_selector('button.sqdOP.L3NKy.y3zKF')
        inputs[0].send_keys(login)
        inputs[1].send_keys(password)

        button.click()
        WebDriverWait(driver, 30).until(
            EC.title_is('Instagram')
        )
        driver.get(f'https://www.instagram.com/{username}/?__a=1')

    body = driver.find_element_by_css_selector('body')
    return json.loads(body.text)


def _scrape_tag(tag, post_scraper, driver_index, num_related=5):
    try:
        driver = drivers[driver_index]
        driver.get(f'https://www.instagram.com/explore/tags/{tag}')

        posts_div = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div.EZdmt'))
        )
        post_links = posts_div.find_elements_by_css_selector('a')
        posts = [link.get_attribute('href') for link in post_links]

        try:
            tags_div = driver.find_element_by_css_selector('div.WSpok')
            related_tag_links = tags_div.find_elements_by_css_selector('a')[:num_related]
            related_tags = [link.text[1:] for link in related_tag_links]
        # some hashtags do not have related tags
        except NoSuchElementException:
            related_tags = []

        image_data = [post_scraper(post, driver) for post in posts]
        return image_data, related_tags
    except Exception:
        print(f'Could not get top posts for {tag}')
        print(driver.page_source[:500])
        print(traceback.format_exc())


def _scrape_post_engagement(post, driver):
    driver.get(post)
    try:
        img = driver.find_element_by_css_selector('img.FFVAD')
        like_count_btn = driver.find_element_by_css_selector('button.sqdOP.yWX7d._8A5w5')
    # skip post if it's a video
    except NoSuchElementException:
        return

    img_link = img.get_attribute('srcset').split(' 640w')[0]

    like_count = like_count_btn.find_element_by_css_selector('span').text
    like_count = int(like_count.replace(',', ''))

    username_div = driver.find_element_by_css_selector('div.e1e1d')
    username = username_div.find_element_by_css_selector('a').text

    return [img_link, _get_engagement_diff(username, like_count, driver)]

#TODO: handle tags being in comment by user
def _scrape_post_tags(post, driver):
    driver.get(post)
    try:
        img = driver.find_element_by_css_selector('img.FFVAD')
    # skip post if it's a video (carousels are not skipped, first image is obtained)
    except NoSuchElementException:
        return

    img_link = img.get_attribute('srcset').split(' 640w')[0]

    caption_div = driver.find_element_by_css_selector('div.C4VMK')
    tags = [elem.text[1:] for elem in caption_div.find_elements_by_css_selector('a.xil3i')]

    return [img_link, tags]


def _format_dataset(dataset):
    posts = []
    for key, curr_posts in dataset.items():
        # skipping hashtags that errored
        if curr_posts is None:
            continue
        for post in curr_posts:
            # skipping videos and individual posts that errored
            if post is None:
                continue
            image, tags = post[0], post[1]
            posts.append({'image': image, 'tags': tags})

    return {'posts': posts}


def _get_engagement_diff(username, post_like_count, driver, num_posts=10):
    user_json = _get_user(username, driver)
    follow_count = user_json['graphql']['user']['edge_followed_by']['count']
    user_posts = user_json['graphql']['user']['edge_owner_to_timeline_media']['edges']
    like_counts = [post['node']['edge_liked_by']['count'] for post in user_posts[:num_posts]]

    post_engagement_rate = post_like_count / follow_count
    avg_engagement_rate = sum(like_counts) / (len(like_counts) * follow_count)
    return post_engagement_rate - avg_engagement_rate
    # TODO: perhaps skip videos...


def _similarity(image, img_link):
    return random()  # TODO: implement actual similarity with model
