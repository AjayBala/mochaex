import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { CaseHeader } from './CaseHeader';

describe('Test suits for <CaseHeader />', () => {
    let wrapper;
    it('should datepicker component exist', () => {
        const notificationData = [{ is_read_already: false }];
        const postNotificationsSuccess = sinon.spy();
        const caseSearchEmptyRequest = sinon.spy();
        const getNotificationList = sinon.spy();
        wrapper = shallow(<CaseHeader
            action={{ postNotificationsSuccess,
                getNotificationList,
                notifications: { data: notificationData },
                caseSearchEmptyRequest }} />);
        const instance = wrapper.instance();
        instance.alertNode = {
            key: 1,
            value: 'abc',
        };
        instance.alertNode.contains = sinon.spy();
        let e = { target: 'abc' };
        instance.notificationNode = {
            key: 1,
            value: 'abc',
        };
        instance.notificationNode.contains = sinon.spy();
        expect(instance.handleClickOutside(e)).to.be.called;
        e = { target: '123' };
        expect(instance.handleClickOutside(e)).to.be.called;
        instance.backToSearch();
        instance.newCase();
        wrapper.find('.notification').at(0).simulate('click');
        expect(wrapper).to.have.length(1);
    });
    it('Check if toggle for Notification Box', () => {
        wrapper.instance().setState({ expandedAlert: false });
        wrapper.instance().toggleNotificationBox();
        expect(wrapper.instance().state.expandedAlert).to.equal(true);
    });
    it('Check if toggle for notifications count is greater than 0', () => {
        wrapper.setProps({ notifications: { data: [{ is_read_already: false }], count: 1, cases: [] } });
        expect(wrapper.find('.notification')).to.have.length(2);
    });

    it('Check the ExtendCase change', () => {
        wrapper.instance().setState({ expandedAlert: true });
        expect(wrapper.instance().state.expandedAlert).to.equal(true);
        expect(wrapper).to.exist;
        // baseVal
        wrapper.instance().setState({ expandedAlert: true });
        expect(wrapper.instance().state.expandedAlert).to.equal(true);
        expect(wrapper).to.exist;

        wrapper.instance().setState({ expandedAlert: true });
        wrapper.instance().render();
        expect(wrapper.instance().state.expandedAlert).to.equal(true);
        expect(wrapper).to.exist;
    });
});
