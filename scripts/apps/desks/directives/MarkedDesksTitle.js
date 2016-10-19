MarkedDesksTitle.$inject = ['desks', '$timeout'];
export function MarkedDesksTitle(desks, $timeout) {
    return {
        scope: {
            item: '=item'
        },
        templateUrl: 'scripts/apps/desks/views/marked_desks_title_directive.html',
        // todo(petr): refactor to use popover-template once angular-bootstrap 0.13 is out
        link: function(scope, elem) {

            /*
             * Toggle 'open' class on dropdown menu element
             * @param {string} isOpen
             */
            scope.toggleClass = function (isOpen) {
                scope.open = isOpen;
            };

            scope.hasMarkItemPrivilege = desks.hasMarkItemPrivilege();

            scope.$on('item:marked_desks', function($event, data) {
                let markedDesks = scope.item.marked_desks || [];
                if (scope.item._id === data.item_id) {
                    scope.$apply(function() {
                        if (data.marked) {
                            scope.item.marked_desks = markedDesks.concat(data.desk_id);
                        } else {
                            scope.item.marked_desks = _.without(markedDesks, data.desk_id);
                        }
                    });
                }
            });

            var closeTimeout, self;

            desks.fetchDesks().then(function() {
                scope.desks = desks.desks._items.filter(desk => (scope.item.marked_desks || []).includes(desk._id));
            });

            elem.on({
                click: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
                mouseenter: function (e) {
                    self = $(this).find('.highlights-list');
                    self.not('.open').children('.dropdown-toggle').click();

                    angular.element('.highlights-list-menu.open').on({
                        mouseenter: function () {
                            $timeout.cancel(closeTimeout);
                        },
                        mouseleave: function () {
                            self.filter('.open').children('.dropdown-toggle').click();
                        }
                    });

                }
            });

            /*
             * Removing marked desk from an item
             * @param {string} desk
             */
            scope.unmarkDesk = function (desk) {
                desks.markItem(desk, scope.item).then(function() {
                    scope.item.marked_desks = _.without(scope.item.marked_desks, desk);
                });
            };
        }
    };
}
