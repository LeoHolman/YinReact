*** Settings ***
Documentation  Keywords for Yin functional testing
Resource  ./objects/login.robot

*** Keywords ***
Student login
    [Documentation]  Students are able to log in
    login.Navigate To
    login.Student Login

Teacher login
    [Documentation]  Teachers are able to log in
    login.Navigate To
    login.Teacher Login

Validate Teacher Can Access Teacher Interface
    login.Navigate To Teacher Interface
    login.Validate Teacher Interface

Validate Student Cannot Access Teacher Interface
    login.Navigate To Teacher Interface
    login.Validate Students Cannot Access Teacher Interface

Validate Login Required
    login.Verify Unauthenticated User Cannot Access Lessons