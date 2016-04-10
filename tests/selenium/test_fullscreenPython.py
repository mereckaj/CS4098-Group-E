# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class TestFullscreenPython(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:8000/login"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_fullscreen_python(self):
        driver = self.driver
        driver.get(self.base_url + "/login")
        driver.find_element_by_id("fbLogin").click()
        driver.find_element_by_xpath("(//button[@type='button'])[5]").click()
        driver.find_element_by_css_selector("div.text-center > button.btn.btn-primary").click()
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "canvas"))
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "canvas"))
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "div.vis-button.vis-zoomExtends"))
        driver.find_element_by_xpath("(//button[@type='button'])[13]").click()
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "canvas"))
        driver.find_element_by_css_selector("div.modal-content-fs > div.modal-header > button.close").click()
        driver.find_element_by_css_selector("button.btn.btn-primary").click()
        driver.find_element_by_id("swimlaneButton").click()
        driver.find_element_by_css_selector("div.modal-content-fs > div.modal-header > button.close").click()
        driver.find_element_by_xpath("(//button[@type='button'])[6]").click()
        driver.find_element_by_id("1").click()
        driver.find_element_by_css_selector("button.close").click()
        driver.find_element_by_xpath("(//button[@type='button'])[5]").click()
        driver.find_element_by_css_selector("div.text-center > button.btn.btn-primary").click()
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "div.vis-button.vis-zoomIn"))
        driver.find_element_by_css_selector("div.modal-content-fs > div.modal-header > button.close").click()
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "div.ace_content"))
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "#visualization > div.vis-network > canvas"))
    
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
