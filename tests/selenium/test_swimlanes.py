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
		print("> Testing Swimlane Graphs")
		driver = self.driver
		# Register and login
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
		# Go to main page
		self.assertEqual("http://localhost:8000/", driver.current_url)
		# Click the editor
		driver.find_element_by_css_selector("div.ace_content").click()
		# Set the ace editor to some value
		driver.find_element_by_class_name("ace_text-input").send_keys("""process a { action one{}  action two {} }""",Keys.RETURN)
		# Draw the graph
		driver.find_element_by_id("swimlaneButton").click()
		# Check that canvas exits
		self.assertEqual("", driver.find_element_by_css_selector("canvas").text)
		# Click the fullscreene button
		driver.find_element_by_id("fullScreenButton").click()
		#Choose fullscreen flow graph
		driver.find_element_by_id("modalFullscreenChoiceSwimlaneButton").click()
		# Assert new canvas appears
		self.assertEqual("", driver.find_element_by_css_selector("canvas").text)

	def tearDown(self):
		self.driver.quit()
		self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
	unittest.main()
