*** Settings ***
Library  SeleniumLibrary

*** Variables ***
${BROWSER} =  chrome

*** Keywords ***
Begin Web Test
    [Documentation]  Start up browser and navigate to URL
    Open Browser  ${BASE_URL}  ${BROWSER}
    Maximize Browser Window

End Web Test
    [Documentation]  Close browser after test has finished
    Close All Browsers