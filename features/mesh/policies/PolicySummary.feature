Feature: Policy summary

  Background:
    Given the CSS selectors
      | Alias                | Selector                                     |
      | items                | [data-testid='app-collection']               |
      | item                 | $items tbody tr                              |
      | summary              | [data-testid='summary']                      |
      | close-summary-button | $summary [data-testid='slideout-close-icon'] |
    And the URL "/meshes/default/meshfaultinjections" responds with
      """
      body:
        items:
          - name: mfi-1
      """

  Scenario: Clicking a row opens the summary
    Given the environment
      """
      KUMA_MESHFAULTINJECTION_COUNT: 1
      """
    When I visit the "/meshes/default/policies/meshfaultinjections" URL
    And I click the "$item:nth-child(1) td:nth-child(2)" element
    Then the "$summary" element exists
    And the "$summary" element contains "mfi-1"
    When I click the "$close-summary-button" element
    Then the "$summary" element doesn't exist
    When I navigate "back"
    Then the "$summary" element exists
    And the "$summary" element contains "mfi-1"
    When I navigate "forward"
    Then the "$summary" element doesn't exist

  Scenario: Summary URL goes to page with open summary
    Given the environment
      """
      KUMA_MESHFAULTINJECTION_COUNT: 51
      """
    When I visit the "/meshes/default/policies/meshfaultinjections/mfi-1?page=2&size=50" URL
    Then the "$summary" element exists
