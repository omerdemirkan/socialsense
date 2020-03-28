from collections import deque
from multiprocessing import Pool
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options

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
    print(f'scraping #{tag} with driver: {driver_index}')
    driver = drivers[driver_index]
    driver.get(f'https://www.instagram.com/explore/tags/{tag}')

    posts_div = driver.find_element_by_css_selector('div.EZdmt')
    post_links = posts_div.find_elements_by_css_selector('a')
    posts = [link.get_attribute('href') for link in post_links]

    tags_div = driver.find_element_by_css_selector('div.WSpok')
    related_tag_links = tags_div.find_elements_by_css_selector('a')[:num_related]
    related_tags = [link.text[1:] for link in related_tag_links]

    return posts, related_tags

scrape(['anime', 'rice', 'cats', 'dogs'])