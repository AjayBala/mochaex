import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomerContactConnect, { CustomerContact } from './CustomerContact';

const customerDetails = {
    firstName: 'Tony',
    lastName: 'Stark',
    phoneNumber: '123-123-1234',
    email: 'tony.stark@jcp.com',
    address1: '1011 Stark Way',
    address2: '',
    city: 'Los Angeles',
    state: 'CA',
    country: 'US',
    zipCode: '90111',
};

const addCallerContact = sinon.spy;

describe('Test suits for <CustomerContact />', () => {
    const mockStore = configureStore([]);
    const store = mockStore(customerDetails);
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store} actions={{ addCallerContact }} >
                <CustomerContactConnect />
            </Provider>,
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should load the CustomerContact component', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });
    it('should CustomerContact without searchlist', () => {
        const isEditCase = true;
        const shallowWrapper = shallow(<CustomerContact
            contactDetails={customerDetails}
            actions={{ addCallerContact }}
            isEditCase={isEditCase}
        />);
        shallowWrapper.instance().toggleBox({ target: { value: true } });
    });
});
