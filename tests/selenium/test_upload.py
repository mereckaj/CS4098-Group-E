# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re, os
import random
class Test_fileUpload(unittest.TestCase):

    path = os.path.join(os.path.abspath(os.path.dirname(__name__)), "tests/" + "pml/" + "simple.pml")
    username = "test_user_" + str(random.randint(1, 10000000))

    def setUp(self):
        self.driver = webdriver.Firefox()
		self.driver.maximize_window()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:8000"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_upload(self):
        driver = self.driver
        driver.get(self.base_url + "/login")
        driver.find_element_by_id("reg").click()
        driver.find_element_by_id("first_name").clear()
        driver.find_element_by_id("first_name").send_keys("test")
        driver.find_element_by_id("last_name").clear()
        driver.find_element_by_id("last_name").send_keys("user")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("Aa1aaaa!")
        driver.find_element_by_id("confirm").clear()
        driver.find_element_by_id("confirm").send_keys("Aa1aaaa!")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys(self.username + "@example.com")
        driver.find_element_by_id("submit").click()
        self.assertEqual("http://localhost:8000/", driver.current_url)
        print("> Testing File drag and drop upload")
        myfile = open(self.path)  
        fileCode = myfile.read()
        myfile.close()

        driver.find_element_by_css_selector("div.ace_content").click()
        driver.execute_script("editor.getSession().setValue('');")
        driver.find_element_by_class_name("ace_text-input").send_keys(fileCode)

        code = driver.execute_script("return editor.getSession().getValue()")
        code = code[0:-20]
        code = code.replace(' ','')
        fileCode = fileCode.replace(' ','')
        self.assertEqual(fileCode,code)

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
  
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
