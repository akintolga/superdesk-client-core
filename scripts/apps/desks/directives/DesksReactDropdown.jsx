/**
 * @ngdoc directive
 * @module superdesk.apps.desks
 * @name DesksReactDropdown
 *
 * @requires React
 * @requires item
 * @requires className
 * @requires desks
 * @requires noDesksLabel
 *
 *
 * @description Creates dropdown react element with list of available desks
 */
import React from 'react';

DesksReactDropdown.$inject = ['item', 'className', 'desks', 'noDesksLabel'];
export function DesksReactDropdown(item, className, desks, noDesksLabel) {
    /** Dropdown component */
    class MarkDesksDropdown extends React.Component {
        render() {
            let items = [];

            if (desks.desks._items.length) {
                desks.desks._items.forEach((d) => {
                    items.push(<MarkedDeskItem key={d._id} desk={d} item={item}/>);
                });
            } else {
                items.push(<li><button disabled="true">{noDesksLabel}</button></li>);
            }

            return (
                <ul className={this.props.className}>
                    {items}
                </ul>
            );
        }
    }

    /** Button component for marking items for desks */
    class MarkBtn extends React.Component {
        constructor(props) {
            super(props);
            this.item = props.item;
            this.desk = props.desk;
            this.isMarked = this.item.marked_desks &&
                this.item.marked_desks.some((md) => md.desk_id === this.desk._id);
            this.markDesk = this.markDesk.bind(this);
        }

        markDesk() {
            event.stopPropagation();
            desks.markItem(this.desk._id, this.item);
        }

        render() {
            return (
                <button disabled= {this.isMarked} onClick={this.markDesk}>
                    <i className="icon-bell" ></i>{this.desk.name}
                </button>
            );
        }
    }

    /** List item created per desk */
    class MarkedDeskItem extends React.Component {
        render() {
            return (
                <li key={'desk-' + this.props.desk._id}>
                    <MarkBtn item={this.props.item} desk={this.props.desk} />
                </li>
            );
        }
    }

    return (
        <MarkDesksDropdown className={className}/>
    );
}