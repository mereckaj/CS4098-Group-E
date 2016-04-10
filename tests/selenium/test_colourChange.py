# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
import random
class Test(unittest.TestCase):

	username = "test_user_" + str(random.randint(1, 10000000))

	def setUp(self):
		self.driver = webdriver.Firefox()
		self.driver.implicitly_wait(1)
		self.base_url = "http://localhost:8000"
		self.verificationErrors = []
		self.accept_next_alert = True

	def test_(self):
		print("> Testing Colour Scheme Changes")
		driver = self.driver
		driver.get(self.base_url + "/login")
		driver.find_element_by_id("reg").click()
		driver.find_element_by_id("first_name").clear()
		driver.find_element_by_id("first_name").send_keys("test")
		driver.find_element_by_id("last_name").clear()
		driver.find_element_by_id("last_name").send_keys("user")
		driver.find_element_by_id("password").clear()
		driver.find_element_by_id("password").send_keys("aaaaaaaa")
		driver.find_element_by_id("confirm").clear()
		driver.find_element_by_id("confirm").send_keys("aaaaaaaa")
		driver.find_element_by_id("email").clear()
		driver.find_element_by_id("email").send_keys(self.username + "@example.com")
		driver.find_element_by_id("submit").click()
		self.assertEqual("http://localhost:8000/", driver.current_url)
		# Add some PML to the editor so that an error does not pop up when colour scheme is cahnged
		driver.find_element_by_css_selector("div.ace_content").click()
		driver.find_element_by_class_name("ace_text-input").send_keys("""process a { action one{}  action two {} }""",Keys.RETURN)
		for index in range(0,4):
			# Open the change colour modal and get all of the colours of the first entry
			driver.find_element_by_id("colourSchemeChangeButton").click()
			self.driver.implicitly_wait(1)
			colourSchemes = []
			colourSchemes.append(driver.find_element_by_id("colourSchemeMiracle" + str(index)))
			colourSchemes.append(driver.find_element_by_id("colourSchemeBlackhole" + str(index)))
			colourSchemes.append(driver.find_element_by_id("colourSchemeTransformer"+ str(index)))
			trueHexColours = []
			for item in colourSchemes:
				rgb = item.value_of_css_property('background-color')
				r,g,b,a = map(int, re.search(r'rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)', rgb).groups())
				trueHexColours.append('#%02x%02x%02x' % (r, g, b))
			# Select the new colour scheme
			driver.find_element_by_id(str(index)).click()
			driver.find_element_by_id("closedModalLegend").click()
			self.driver.implicitly_wait(1)
			# Check if new colour scheme changes have been applied
			colourSchemes = []
			colourSchemes.append(driver.find_element_by_id("miracle_button_2"))
			colourSchemes.append(driver.find_element_by_id("blackhole_button_2"))
			colourSchemes.append(driver.find_element_by_id("transformer_button_2"))
			testHexColours = []
			for item in colourSchemes:
				rgb = item.value_of_css_property('background-color')
				r,g,b,a = map(int, re.search(r'rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)', rgb).groups())
				testHexColours.append('#%02x%02x%02x' % (r, g, b))
			self.assertEqual(trueHexColours,testHexColours)
			self.driver.implicitly_wait(1)

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
