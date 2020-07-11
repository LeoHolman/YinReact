*** Settings ***
Documentation  Login functionality
Library  SeleniumLibrary
Resource  resources/dev.robot
Resource  resources/YinApp.robot
Resource  resources/commonweb.robot
Test Setup  Begin Web Test
Test Teardown  End Web Test

# robot -d results login.robot

*** Variables ***

*** Test Cases ***
User should be able to log in
    YinApp.Student login

User not logged in cannot view page
    [Documentation]  Users who are not logged in cannot access page
    YinApp.Validate Login Required

Teachers can access teacher interface
    [Documentation]  Teachers are able to access teacher interface
    YinApp.Teacher login
    YinApp.Validate Teacher Can Access Teacher Interface

Students cannot access teacher interface
    [Documentation]  Students are not able to access teacher interface
    YinApp.Student Login
    YinApp.Validate Student Cannot Access Teacher Interface

    