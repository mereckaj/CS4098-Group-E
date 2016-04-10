# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
import random
class TestEditor(unittest.TestCase):
	username = "test_user_" + str(random.randint(1, 10000000))
	def setUp(self):
		self.driver = webdriver.Firefox()
		self.driver.implicitly_wait(30)
		self.base_url = "http://localhost:8000"
		self.verificationErrors = []
		self.accept_next_alert = True

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

	def test_editor(self):
		driver = self.driver
		# Register, login and logout
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

		# Log out
		driver.find_element_by_xpath("//div[@id='bs-example-navbar-collapse-1']/ul[2]/li/a").click()
		driver.find_element_by_link_text("Logout").click()
		self.assertEqual("http://localhost:8000/login", driver.current_url)

		# Send password reset email
		driver.find_element_by_link_text("Forgot Password").click()
		self.assertEqual("http://localhost:8000/reset_password", driver.current_url)
		driver.find_element_by_id("email").send_keys(self.username + "@example.com");
		driver.find_element_by_id("submit").click()
		driver.find_element_by_id("backToLogin").click()
		self.assertEqual("http://localhost:8000/login", driver.current_url)

		# Go to password reset page and change the password
		driver.get(self.base_url + "/test/reset/"+self.username + "@example.com")
		driver.find_element_by_id("password").clear()
		driver.find_element_by_id("password").send_keys("Ba1aaaa!")
		driver.find_element_by_id("confirm").clear()
		driver.find_element_by_id("confirm").send_keys("Ba1aaaa!")
		driver.find_element_by_id("submit").click()

		# After password reset we are logged in, logout
		driver.find_element_by_xpath("//div[@id='bs-example-navbar-collapse-1']/ul[2]/li/a").click()
		driver.find_element_by_link_text("Logout").click()
		self.assertEqual("http://localhost:8000/login", driver.current_url)

		# Test the new password
		driver.get(self.base_url + "/login")
		driver.find_element_by_id("email").clear()
		driver.find_element_by_id("email").send_keys(self.username + "@example.com")
		driver.find_element_by_id("password").clear()
		driver.find_element_by_id("password").send_keys("Ba1aaaa!")
		driver.find_element_by_id("submit").click()
		self.assertEqual("http://localhost:8000/", driver.current_url)

	def tearDown(self):
		self.driver.quit()
		self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
	unittest.main()
