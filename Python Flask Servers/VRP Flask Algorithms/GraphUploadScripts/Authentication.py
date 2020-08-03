from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import SessionNotCreatedException
from imgurpython import ImgurClient
import os

imgur_username = "VehicleRoutingProblem"
imgur_password = "-YD.cWD@rZ5b/Tq"
client_id = "f7771d0cbfa9271"
client_secret = "4013961f68a223b982ebfbcdd2f2e46d05725b08"

client = ImgurClient(client_id, client_secret)
authorisation_url = client.get_auth_url('pin')

# This function was implemented with help from this tutorial: https://www.youtube.com/watch?v=kDcn_Tn-ti8
def authenticate(): 
    try:
        location = str(os.path.abspath("GraphUploadScripts/Browser Drivers/chromedriver.exe")).replace("\\","/")
        location = location[:1].upper() + location[1:]
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(executable_path=location, options=chrome_options)
        return getPin(driver)
    except SessionNotCreatedException:
        try:
            location = str(os.path.abspath("Browser Drivers/geckodriver.exe")).replace("\\", "/")
            location = location[:1].upper() + location[1:]
            firefox_options = webdriver.FirefoxOptions()
            firefox_options.add_argument('-headless')
            driver = webdriver.Firefox(executable_path=location, options=firefox_options, service_log_path=os.path.devnull)
            return getPin(driver)
        except:
            print("You need to have Chrome or Firefox installed to run this")

def getPin(driver):
    driver.get(authorisation_url)
        
    username = driver.find_element_by_xpath('//*[@id="username"]')	
    password = driver.find_element_by_xpath('//*[@id="password"]')
    username.clear()
    username.send_keys(imgur_username)
    password.send_keys(imgur_password)

    driver.find_element_by_name("allow").click()

    timeout = 5
    try:
        element_present = EC.presence_of_element_located((By.ID, 'pin'))
        WebDriverWait(driver, timeout).until(element_present)
        pin_element = driver.find_element_by_id('pin')
        pin = pin_element.get_attribute("value")
    except TimeoutException:
        print("Timed out waiting for page to load")

    driver.close()
    
    credentials = client.authorize(pin, 'pin')
    client.set_user_auth(credentials['access_token'], credentials['refresh_token'])
    return client

if __name__ == "__main__":
    authenticate()