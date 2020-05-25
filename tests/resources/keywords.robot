*** Settings ***
Documentation  Keywords for Yin functional testing

*** Keywords ***
Teacher Login
    [Documentation]  Log a student in given an open browser
    Wait Until Page Contains  Login
    Input Text  css:input#username  teacher_test
    Input Text  css:input#password  absurd_jellyfish
    Click Button  css:input[type=submit]
    Wait Until Page Contains  Welcome to Yin

Student Login
    [Documentation]  Log a student in given an open browser
    Wait Until Page Contains  Login
    Input Text  css:input#username  student_test
    Input Text  css:input#password  intermediate_consummation
    Click Button  css:input[type=submit]
    Wait Until Page Contains  Welcome to Yin

