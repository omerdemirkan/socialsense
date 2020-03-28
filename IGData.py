import traceback
from collections import deque
from multiprocessing import Pool
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

pool_size = 4

driver_options = Options()
driver_options.add_argument('--headless')
drivers = [Chrome('./chromedriver', options=driver_options) for _ in range(pool_size)]

def scrape(starting_tags):
    tag_Q = deque(starting_tags)
    seen_tags = dict.fromkeys(tag_Q)

    while len(tag_Q) > 0:
        curr_tags = [tag_Q.popleft() for _ in range(min(pool_size, len(tag_Q)))]
        
        pool = Pool(len(curr_tags))
        args = [[curr_tags[i], i] for i in range(len(curr_tags))]
        results = pool.starmap(scrape_tag, args)
        pool.close()
        pool.join()

        print(results)

def scrape_tag(tag, driver_index, num_related=5):
    try:
        print(f'scraping #{tag} with driver: {driver_index}')
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

    return [img_link, like_count]

    return img_link

# remember to call this to prevent memory leaks
def quit_drivers():
    [driver.quit() for driver in drivers]

scrape(['anime', 'rice', 'cats', 'dogs'])
quit_drivers()