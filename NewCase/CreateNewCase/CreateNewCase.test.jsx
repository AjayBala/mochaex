import { Provider } from 'react-redux';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import _clone from 'lodash/clone';
import configureStore from 'redux-mock-store';
import CreateNewCaseConnected, { renderFieldInput, renderSelectDropdown, renderTextArea, normalizeMaxLength, CreateNewCase } from './CreateNewCase';
import {
    validateStreet,
    validateEmail,
    validateSearchType,
    validateApt,
    validateZip,
    validateOrder,
} from '../../../common/Util';
import responceData from '../mock.json';

describe('CreateNewCase', () => {
    let component;
    const submitCase = sinon.spy();
    let wrapperRedComp;
    const newCaseInfo = {
        addCallerContact: true,
        contactAvailable: true,
        caseDetails: _clone(responceData),
    };
    beforeEach(() => {
        const mockStore = configureStore([]);
        const store = mockStore({
            context: { deviceType: { isDesktop: false } },
        });
        const handleSubmit = sinon.spy();
        const onChange = sinon.spy();
        const params = { caseId: '9987485647564' };
        const isEditCase = true;
        wrapperRedComp = shallow(<CreateNewCase
            isEditCase={isEditCase}
            newCaseInfo={newCaseInfo}
            params={params} handleSubmit={handleSubmit} submitCase={submitCase} change={onChange}/>);
        component = mount(
            <Provider store={store}>
                <CreateNewCaseConnected submitCase={submitCase}/>
            </Provider>,
        );
    });
    it('component should exist', () => {
        expect(component).to.exist;
    });
    it('First Name text change', () => {
        component.find('input').at(0).props().onChange();
    });
    it('First Name text change', () => {
        component.find('input').at(0).props().onChange('a');
    });
    it('First Name text change', () => {
        component.find('input').at(0).props().onChange('12');
    });
    it('First Name text change', () => {
        component.find('form').at(0).props().onSubmit();
    });
    it('First Name text change', () => {
        const data = {
            target: { value: 'f' },
        };
        component.find('Input').at(0).props().onBlur(data);
    });
    it('Should be called validateApt with minimum character', () => {
        const aptError = validateApt('hi', 'Apt');
        expect(aptError).to.equal('');
    });
    it('Should be called validateApt with maximum character', () => {
        const aptError = validateApt('contain maximum of 40 char', 'Apt');
        expect(aptError).to.equal('Apt should contain maximum of 10 characters');
    });
    it('Should be called validateStreet with minimum character', () => {
        const streetError = validateStreet('old street', 'street');
        expect(streetError).to.equal('street should contain minimum 15 characters');
    });
    it('Should be called validateStreet with maximum character', () => {
        const streetVal = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretiums.';
        const streetError = validateStreet(streetVal, 'street');
        expect(streetError).to.equal('street should contain maximum of 250 characters');
    });
    it('Should be called validateOrder with maximum number', () => {
        const orderError = validateOrder('12345678901234567', 'order');
        expect(orderError).to.equal('Order number should contain maximum of 16 numbers');
    });
    it('Should be called validateEmail with maximum character', () => {
        const emailError = validateEmail('raj.jcpenneyphotoninfo123456minimumcharacter343553654uncontrolledcomponents@gmail.com');
        expect(emailError).to.equal('Email should be less than 80 characters');
    });

    it('Should be called validateSearchType with invalid search', () => {
        const searchError = validateSearchType('12345678abc234567cdsaaa', 'email');
        expect(searchError).to.equal('invalid');
    });
    it('Should be called validateZip with invalid zip', () => {
        const zipError = validateZip('werwre', false);
        expect(zipError).to.equal('Zip should contain numeric only');
    });
    it('Should be called validateZip with minimum zip code', () => {
        const zipError = validateZip('123', false);
        expect(zipError).to.equal('Zip should contain minimum of 4 numbers');
    });
    it('Should be called validateZip with maximum zip code', () => {
        const zipError = validateZip('1232342', false);
        expect(zipError).to.equal('Zip should contain maximum of 5 numbers');
    });
    it('Should be called validateZip with zip code', () => {
        const zipError = validateZip('12323', false);
        expect(zipError).to.equal('');
    });

    it('renders an error message for the input', () => {
        const input = { name: 'firstName', value: '4' };
        const label = 'First name';
        const meta = { touched: true, error: 'Required' };
        const type = 'CCR';
        const id = '';
        const dataAutomationId = '';
        const disabled = true;
        const element = renderFieldInput({ disabled, input, label, type, id, dataAutomationId, meta });
        shallow(element);
    });
    it('renders an error message for the input', () => {
        const input = { name: 'firstName', value: 'Missouri' };
        const label = 'First name';
        const meta = { touched: true, error: 'Required' };
        const value = 'val';
        const id = '';
        const datasource = [
            {
                displayKey: 'Missouri',
                value: 'Missouri',
            },
            {
                displayKey: 'Montana',
                value: 'Montana',
            },
        ];
        const disabled = true;
        const element = renderSelectDropdown({ disabled, input, label, value, id, datasource, meta });
        shallow(element);
    });
    it('renders an error message for the input', () => {
        const input = { name: 'firstName', value: '2' };
        const label = 'First name';
        const meta = { touched: true, error: 'Required' };
        const disabled = true;
        const element = renderTextArea({ disabled, input, label, meta });
        shallow(element);
    });
    it('Should be check 6 digits number', () => {
        const val = 'test messga';
        const maxChars = normalizeMaxLength(7)(val);
        expect(maxChars).to.equal('test me');
    });
    it('alertCancelButton is called', () => {
        wrapperRedComp.instance().alertCancelButton();
    });
    it('alertProceedButton is called', () => {
        wrapperRedComp.instance().alertProceedButton();
    });
    it('update case for editable values', () => {
        const val = {
            OrderNumber: 232445,
            firstName: 'raj',
            lastName: 'star',
            phoneNumber: '234 343-3455',
            email: 'raj.jcp@gmail.com',
            streetAdress: 'asd',
            apt: 'wee',
            city: 'chen',
            state: 'qwe',
            zip: '12345',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
    it('Called cancel button with update case editable values', () => {
        const val = {
            OrderNumber: 232445,
            firstName: 'raj',
            lastName: 'star',
            phoneNumber: '',
            email: 'raj.jcp@gmail.com',
            streetAdress: 'asd',
            apt: 'wee',
            city: 'chen',
            state: 'qwe',
            zip: '12345',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });

    it('Called function oninput change', () => {
        const e = { target: {
            name: 'desc',
            value: ' ',
        } };
        wrapperRedComp.instance().onInputChange(e);
    });
    it('Input text change', () => {
        const e = { target: {
            name: 'desc',
            value: ' ',
        } };
        component.find('form').at(0).props().onChange(e);
    });
});

describe('Update case with guest', () => {
    const newCaseInfo = {
        addCallerContact: true,
        contactAvailable: true,
        caseDetails: _clone(responceData),
    };
    let component;
    const submitCase = sinon.spy();
    beforeEach(() => {
        const mockStore = configureStore([]);
        const store = mockStore({
            context: { deviceType: { isDesktop: false } },
        });
        const data = {
            isEditCase: true,
            addCallerContact: true,
        };
        component = mount(
            <Provider store={store}>
                <CreateNewCaseConnected newCaseInfo={newCaseInfo} caseInfo={data} submitCase={submitCase}/>
            </Provider>,
        );
    });
    it('component should exist', () => {
        expect(component).to.exist;
    });
});
describe('Update case with Registered customer', () => {
    let component;
    const submitCase = sinon.spy();
    let wrapperRedComp;
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: true,
        caseDetails: {
            priority: 'low',
            contacts: [{
                id: '1079453232',
                type: 'guest',
                firstName: 'John',
                lastName: 'James',
                phoneNumber: '5417543010',
                email: 'John@mailinator.com',
                address1: 'Megasystems Inc, Suite 5a-1204',
                address2: 'Center For Financial Assistance To Deposed Nigerian Royalty',
                city: 'Columbia',
                state: 'Texas',
                country: 'USA',
                zipCode: '85705',
            }],
        } };
    beforeEach(() => {
        const mockStore = configureStore([]);
        const store = mockStore({
            context: { deviceType: { isDesktop: false } },
        });
        const handleSubmit = sinon.spy();
        const params = { caseId: '9987485647564' };
        const isEditCase = true;
        wrapperRedComp = shallow(<CreateNewCase
            isEditCase={isEditCase}
            newCaseInfo={newCaseInfo}
            params={params} handleSubmit={handleSubmit} submitCase={submitCase}/>);
        component = mount(
            <Provider store={store}>
                <CreateNewCaseConnected submitCase={submitCase}/>
            </Provider>,
        );
    });
    it('component should exist', () => {
        expect(component).to.exist;
    });
    it('Called cancel button with phoneNumber', () => {
        const val = {
            phoneNumber: '234 343-3455',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
    it('Called cancel button with email', () => {
        const val = {
            phoneNumber: '541 754-3010',
            email: 'raj@gmail.com',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
    it('Called cancel button with firstName', () => {
        const val = {
            phoneNumber: '541 754-3010',
            email: 'John@mailinator.com',
            firstName: 'raj',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
    it('Called cancel button with firstName', () => {
        const val = {
            phoneNumber: '541 754-3010',
            email: 'John@mailinator.com',
            firstName: 'John',
            lastName: 'max',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
    it('Called cancel button with firstName', () => {
        const val = {
            phoneNumber: '541 754-3010',
            email: 'John@mailinator.com',
            firstName: 'John',
            lastName: 'James',
            priority: 'High',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
});

describe('Update case with guest', () => {
    let component;
    const submitCase = sinon.spy();
    let wrapperRedComp;
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: true,
        caseDetails: {
            contacts: [],
        } };
    beforeEach(() => {
        const mockStore = configureStore([]);
        const store = mockStore({
            context: { deviceType: { isDesktop: false } },
        });
        const handleSubmit = sinon.spy();
        const params = { caseId: '9987485647564' };
        const isEditCase = true;
        wrapperRedComp = shallow(<CreateNewCase
            isEditCase={isEditCase}
            newCaseInfo={newCaseInfo}
            params={params} handleSubmit={handleSubmit} submitCase={submitCase}/>);
        component = mount(
            <Provider store={store}>
                <CreateNewCaseConnected submitCase={submitCase}/>
            </Provider>,
        );
    });
    it('component should exist', () => {
        expect(component).to.exist;
    });
    it('Called cancel button with phonenumber', () => {
        const val = {
            phoneNumber: '234 343-3455',
        };
        wrapperRedComp.instance().cancelSubmit(val);
    });
});
