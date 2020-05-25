*** Settings ***
Documentation  Login functionality
Library  SeleniumLibrary
Resource  resources/dev.robot
Resource  resources/keywords.robot

*** Variables ***

*** Test Cases ***
User can log in
    [Documentation]  Users are able to log in
    Open Browser  ${LOGIN_URL}  chrome 
    Teacher Login
    Close Browser 

User not logged in cannot view page
    [Documentation]  Users who are not logged in cannot access page
    Open Browser  ${BASE_URL}  chrome
    Wait Until Page Contains  Welcome to Yin
    Maximize Browser Window
    Click Element  css:#nav-lessons-quizzes
    Page Should Contain Element  css:form#loginform
    Close Browser

Teachers can access teacher interface
    [Documentation]  Teachers are able to access teacher interface
    Open Browser  ${LOGIN_URL}  chrome
    Teacher Login
    Go To  ${TEACHER_INTERFACE_URL}
    Page Should Contain  Lessons | 
    Close Browser

Students cannot access teacher interface
    [Documentation]  Students are not able to access teacher interface
    Open Browser  ${LOGIN_URL}  chrome
    Student Login
    Go To  ${TEACHER_INTERFACE_URL}
    Page Should Not Contain  Lessons |
    Close Broswer

    