# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
import random
class TestRegister(unittest.TestCase):

	username = "test_user_" + str(random.randint(1, 10000000))

	def setUp(self):
		self.driver = webdriver.Firefox()
		self.driver.maximize_window()
		self.driver.implicitly_wait(30)
		self.base_url = "http://localhost:8000"
		self.verificationErrors = []
		self.accept_next_alert = True

	def test_register_normal(self):
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
		# Logout the user so that login test can pass
		driver.find_element_by_xpath("//div[@id='bs-example-navbar-collapse-1']/ul[2]/li/a").click()
		driver.find_element_by_link_text("Logout").click()
		self.assertEqual("http://localhost:8000/login", driver.current_url)

	def test_register_bad_password(self):
		driver = self.driver
		driver.get(self.base_url + "/login")
		driver.find_element_by_id("reg").click()
		driver.find_element_by_id("first_name").clear()
		driver.find_element_by_id("first_name").send_keys("test")
		driver.find_element_by_id("last_name").clear()
		driver.find_element_by_id("last_name").send_keys("user")
		driver.find_element_by_id("password").clear()
		driver.find_element_by_id("password").send_keys("a")
		driver.find_element_by_id("confirm").clear()
		driver.find_element_by_id("confirm").send_keys("a")
		driver.find_element_by_id("email").clear()
		driver.find_element_by_id("email").send_keys(self.username + "@example.com")
		driver.find_element_by_id("submit").click()
		self.assertEqual("Password is too weak, make sure it meets all of the required conditions", driver.find_element_by_xpath("//div[2]/div/div[2]").text)
		self.assertEqual("Password must be between 8 and 64 characters long", driver.find_element_by_css_selector("div.alert.alert-danger").text)

	def test_register_bad_email_form(self):
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
		driver.find_element_by_id("email").send_keys(self.username + "example.com")
		driver.find_element_by_id("submit").click()
		self.assertEqual("Invalid email address. It must be *@*.* or similar.", driver.find_element_by_css_selector("div.alert.alert-danger").text)

	def test_register_bad_email_short(self):
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
		driver.find_element_by_id("email").send_keys("e@e.c")
		driver.find_element_by_id("submit").click()
		self.assertEqual("Email must be between 6 and 64 characters long", driver.find_element_by_css_selector("div.alert.alert-danger").text)

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
