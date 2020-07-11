*** Settings ***
Documentation  Login related keywords 
Library  SeleniumLibrary

*** Keywords ***
Navigate To
    Go To  ${LOGIN_URL}
    Wait Until Page Contains  Login

Navigate To Teacher Interface
    Go To  ${TEACHER_INTERFACE_URL}
    Wait Until Page Contains  Lessons | 

Teacher Login
    [Documentation]  Log a teacher in given an open browser
    Input Text  css:input#username  teacher_test
    Input Text  css:input#password  absurd_jellyfish
    Click Button  css:input[type=submit]
    Wait Until Page Contains  Welcome to Yin

Student Login
    [Documentation]  Log a student in given an open browser
    Input Text  css:input#username  student_test
    Input Text  css:input#password  intermediate_consummation
    Click Button  css:input[type=submit]
    Wait Until Page Contains  Welcome to Yin

Verify Unauthenticated User Cannot Access Lessons
    [Documentation]  Unauthenticated users should be met with login
    Wait Until Page Contains  Welcome to Yin
    Maximize Browser Window
    Click Element  css:#nav-lessons-quizzes
    Page Should Contain Element  css:form#loginform

Validate Teacher Interface
    Page Should Contain  Lessons |

Validate Students Cannot Access Teacher Interface
    Page Should Not Contain  Lessons |
