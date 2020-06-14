*** Settings ***
Documentation  Quiz functionality
Library  SeleniumLibrary
Resource  resources/dev.robot
Resource  resources/keywords.robot

*** Test Cases ***
Students can access activity 1
    Open Browser  ${LOGIN_URL}  chrome
    Student Login
    Go To  ${LESSONS_URL}
    Wait Until Page Contains Element  css:.meta
    Click Element  css:.meta:first-of-type
    Click Element  css:#link-activity1
    Wait Until Page Contains Element  css:#header-activity
    Page Should Contain  Activity 1
    Close Browser

Students can complete activity 1
    Open Browser  ${LOGIN_URL}  chrome
    Student Login
    Go To  ${LESSONS_URL}
    Wait Until Page Contains Element  css:.meta
    Click Element  css:.meta:first-of-type
    Click Element  css:#link-activity1
    Wait Until Page Contains Element  css:#header-activity
    Page Should Contain  Activity 1
    Click Element  css:.inner-response:first-of-type
    Click Element  css:#submitAnswer
    Click Element  css:#nextQuestion
    Wait Until Page Contains  Question
    Element Should Contain  css=#currentQuestionNumber  2
    Close Browser

Students can access activity 2
    [Documentation]  Students can access activity 2
    Open Browser  ${LOGIN_URL}  chrome
    Student Login
    Go To  ${LESSONS_URL}
    Wait Until Page Contains Element  css:.meta
    Click Element  css:.meta:first-of-type
    Click Element  css:#link-activity2
    Wait Until Page Contains Element  css:#header-activity
    Page Should Contain  Activity 2
    Close Browser
    