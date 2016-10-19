MarkDesksDropdown.$inject = ['desks', '$timeout'];
export function MarkDesksDropdown(desks, $timeout) {
    return {
        templateUrl: 'scripts/apps/desks/views/mark_desks_dropdown_directive.html',
        link: function(scope) {

            scope.markItem = function(desk) {
                scope.item.multiSelect = false;
                desks.markItem(desk._id, scope.item);
            };

            scope.isMarked = function(desk) {
                return scope.item && scope.item.marked_desks && scope.item.marked_desks.indexOf(desk._id) >= 0;
            };

            desks.fetchDesks().then(function(result) {
                console.log('Results:', result);
                scope.desks = result._items;
                $timeout(function () {
                    var deskDropdown = angular.element('.more-activity-menu.open .dropdown-noarrow');
                    var buttons = deskDropdown.find('button:not([disabled])');
                    if (buttons.length > 0) {
                        buttons[0].focus();
                    }
                });
            });
        }
    };
}
