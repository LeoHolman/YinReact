*** Settings ***
Documentation  Quiz functionality
Resource  resources/dev.robot
Resource  resources/keywords.robot

*** Test Cases ***
Students can access activity 1
    Open Browser  ${LOGIN_URL}  chrome
    Student Login
    Go To  ${LESSONS_URL}
    Click Element  css=.meta:first-of-type
    Click Element  css=
    