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

login, password = os.environ['IGLOGIN'], os.environ['IGPASS']
pool_size = 8
visible = False
drivers = [] # will initialize with initialize_drivers

def rank_tags(username, image, total=100, num_starting=15):
    if login is None or password is None:
        raise Exception('Missing login and password. Set values with set_login_password.')
    if len(drivers) == 0:
        initialize_drivers()

    seen_tags = scrape(get_user_tags(username, num_starting), total)
    
    tag_scores = {}
    for tag in seen_tags:
        # skip failed tags
        if seen_tags[tag] is None: continue
        weighted_diffs = []
        for post in seen_tags[tag]:
            # skip failed posts
            if post is None: continue
            img_link, engagement_diff = post[0], post[1]
            weighted_diffs.append(similarity(image, img_link) * engagement_diff)
        tag_scores[tag] = sum(weighted_diffs) / len(weighted_diffs)

    return tag_scores

def scrape(starting_tags, total=4):
    tag_Q = deque(starting_tags)
    seen_tags = dict.fromkeys(tag_Q)

    while len(tag_Q) > 0:
        curr_tags = [tag_Q.popleft() for _ in range(min(pool_size, len(tag_Q)))]
        print(f'Current hashtags: {curr_tags}')
        
        pool = Pool(len(curr_tags))
        args = [[curr_tags[i], i] for i in range(len(curr_tags))]
        results = pool.starmap(scrape_tag, args)
        pool.close()
        pool.join()

        # parsing results
        for i in range(len(results)):
            # if call to _scrape_tag failed, skip that result
            if results[i] is None: continue
            image_engagements, related_tags = results[i][0], results[i][1]

            seen_tags[curr_tags[i]] = image_engagements
            for tag in related_tags:
                if len(seen_tags) >= total: break
                if tag not in seen_tags:
                    tag_Q.append(tag)
                    seen_tags[tag] = None
    
    return seen_tags

def scrape_tag(tag, driver_index, num_related=5):
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

        image_data = [scrape_post_engagement(post, driver) for post in posts]
        return image_data, related_tags
    except:
        print(f'Could not get top posts for {tag}')
        print(driver.page_source[:500])
        print(traceback.format_exc())

def scrape_post_engagement(post, driver):
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

    return [img_link, get_engagement_diff(username, like_count, driver)]

def get_engagement_diff(username, post_like_count, driver, num_posts=10):
    user_json = get_user(username, driver)
    follow_count = user_json['graphql']['user']['edge_followed_by']['count']
    user_posts = user_json['graphql']['user']['edge_owner_to_timeline_media']['edges']
    like_counts = [post['node']['edge_liked_by']['count'] for post in user_posts[:num_posts]]

    post_engagement_rate = post_like_count / follow_count
    avg_engagement_rate = sum(like_counts) / (len(like_counts) * follow_count)        
    return post_engagement_rate - avg_engagement_rate
    #TODO: perhaps skip videos...

def get_user_tags(username, num_tags=15, driver_index=0):
    driver = drivers[driver_index]
    user_json = get_user(username, driver)
    user_posts = user_json['graphql']['user']['edge_owner_to_timeline_media']['edges']

    user_tags = set()
    for post in user_posts:
        caption = post['node']['edge_media_to_caption']['edges'][0]['node']['text']
        
        # lazily iterating through tags
        for match in re.finditer(r'\#\w+', caption):
            tag = match.group(0)[1:]
            user_tags.add(tag)
            if len(user_tags) == num_tags: return user_tags

    return user_tags

def get_user(username, driver):
    driver.get(f'https://www.instagram.com/{username}/?__a=1')

    # logging in if needed
    if driver.page_source[:19] != '<html><head></head>':
        inputs = WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'input'))
        )
        inputs = driver.find_elements_by_css_selector('input')
        button = driver.find_element_by_css_selector('button.sqdOP.L3NKy.y3zKF')
        inputs[0].send_keys(login) #TODO: add username, pass variables that user can set
        inputs[1].send_keys(password)
        button.click()
        WebDriverWait(driver, 30).until(
            EC.title_is('Instagram')
        )
        driver.get(f'https://www.instagram.com/{username}/?__a=1')
    
    body = driver.find_element_by_css_selector('body')
    return json.loads(body.text)

def similarity(image, img_link):
    return random() #TODO: implement actual similarity with model

def initialize_drivers():
    global drivers
    driver_options = Options()
    if not visible: driver_options.add_argument('--headless')
    drivers = [Chrome('./chromedriver', options=driver_options) for _ in range(pool_size)]

# remember to call this to prevent memory leaks
def quit_drivers():
    [driver.quit() for driver in drivers]

initialize_drivers()
print(rank_tags('thehalaalbites', None))
quit_drivers()