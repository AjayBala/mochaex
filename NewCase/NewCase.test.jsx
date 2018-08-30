import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _clone from 'lodash/clone';
import { describe, it } from 'mocha';
import { NewCase } from './NewCase';
import data from './mock.json';

describe('<NewCaseConnected />', () => {
    const newCaseInfo = {
        addCallerContact: true,
        contactAvailable: true,
        caseDetails: _clone(data),
        contactDetails: {
            firstName: 'Richard',
            lastName: 'Marshal',
            phoneNumber: '1231231234',
            email: 'test@test.com',
            address1: '2900',
            address2: 'dallas pkwy',
            city: 'Plano',
            state: 'TX',
            zipCode: '75093',
            id: 430048933,
        },
    };
    const onCloseConfirmModal = sinon.spy();
    const doCreateNewCase = sinon.spy();

    const wrapperForm = shallow(<NewCase
        newCaseInfo={newCaseInfo}
        actions={{ doCreateNewCase, onCloseConfirmModal }}
        />);
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
    it('closeModal function should be invoked', () => {
        const val = {
            case: 2,
            priority: '2',
            desc: 'Testing',
            order: '3456789876542',
            type: 'Registered',
            firstName: '',
            lastName: '',
            phoneNumber: '123 123-1234',
            email: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
        };
        wrapperForm.instance().submitCase(val);
    });
    it('backToSearch function should be invoked', () => {
        wrapperForm.instance().backToSearch();
    });
    it('closeModal function should be invoked', () => {
        const val = {
            case: 2,
            priority: '2',
            desc: 'Testing',
            order: '3456789876542',
            type: 'Caller',
            firstName: 'test',
            lastName: 'user',
            phoneNumber: '',
            email: 'test@test.com',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
        };
        wrapperForm.instance().submitCase(val);
    });
});

describe('<NewCaseConnected />', () => {
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    newCaseInfo.caseDetails.contacts[0].type = 'registered';
    const onCloseConfirmModal = sinon.spy();
    const doCreateNewCase = sinon.spy();

    const wrapperForm = shallow(<NewCase
        newCaseInfo={newCaseInfo}
        actions={{ onCloseConfirmModal, doCreateNewCase }}
        />);
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
    it('closeModal function should be invoked', () => {
        const val = {
            case: 2,
            priority: '2',
            desc: 'Testing',
            order: '3456789876542',
            type: 'guest',
            firstName: 'Prakash',
            lastName: 'Raj',
            phoneNumber: '8768768764',
            email: 'prakash.raj@gmail.com',
            address1: '6501 Legacy Drive',
            address2: 'Suite 200',
            city: 'dfdgg',
            state: 'TX',
            zipCode: '75024',
            country: 'USA',
        };
        wrapperForm.instance().submitCase(val);
    });
});

describe('<NewCaseConnected />', () => {
    const newCaseInfo = {
        addCallerContact: true,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    const onChangeFirstName = sinon.spy();
    const onChangeLastName = sinon.spy();
    const onChangePhone = sinon.spy();
    const onChangeEmail = sinon.spy();
    const onChangeStreet = sinon.spy();
    const onChangeApt = sinon.spy();
    const onChangeZip = sinon.spy();
    const onChangeCity = sinon.spy();
    const onChangeOrderNumber = sinon.spy();
    const onChangeDescription = sinon.spy();
    const handleSubmitForm = sinon.spy();
    const doCreateNewCase = sinon.spy();
    const doUpdateCase = sinon.spy();
    const boolVal = true;
    const wrapperForm = shallow(<NewCase
        isEditCase={boolVal}
        newCaseInfo={newCaseInfo}
        params={{ caseId: 4 }}
        actions={{
            onChangeFirstName,
            doUpdateCase,
            onChangeLastName,
            onChangePhone,
            onChangeEmail,
            onChangeStreet,
            onChangeApt,
            doCreateNewCase,
            onChangeZip,
            onChangeCity,
            onChangeOrderNumber,
            onChangeDescription,
            handleSubmitForm,
        }}/>);
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
    it('checking case component', () => {
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
});

describe('<NewCaseConnected />', () => {
    const newCaseInfo = {
        addCallerContact: true,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    const onChangeFirstName = sinon.spy();
    const onChangeLastName = sinon.spy();
    const onChangePhone = sinon.spy();
    const onChangeEmail = sinon.spy();
    const onChangeStreet = sinon.spy();
    const onChangeApt = sinon.spy();
    const onChangeZip = sinon.spy();
    const onChangeCity = sinon.spy();
    const onChangeOrderNumber = sinon.spy();
    const onChangeDescription = sinon.spy();
    const handleSubmitForm = sinon.spy();
    const doCreateNewCase = sinon.spy();
    const doUpdateCase = sinon.spy();
    const boolVal = true;
    const wrapperForm = shallow(<NewCase
        isEditCase={boolVal}
        newCaseInfo={newCaseInfo}
        params={{ caseId: 4 }}
        actions={{
            onChangeFirstName,
            doUpdateCase,
            onChangeLastName,
            onChangePhone,
            onChangeEmail,
            onChangeStreet,
            onChangeApt,
            doCreateNewCase,
            onChangeZip,
            onChangeCity,
            onChangeOrderNumber,
            onChangeDescription,
            handleSubmitForm,
        }}/>);
    const val = {
        OrderNumber: 232445,
        firstName: 'raj',
        lastName: 'star',
        phoneNumber: '234 234-2344',
        email: 'raj.jcp@gmail.com',
        streetAdress: 'asd',
        apt: 'wee',
        city: 'chen',
        state: 'qwe',
        zip: '12345',
    };
    it('checking case component', () => {
        wrapperForm.instance().submitCase(val);
    });
    it('Update case for existing customer with caller contact and without edit phone number', () => {
        val.phoneNumber = '541 754-3010';
        wrapperForm.instance().submitCase(val);
    });
    it('Update case for existing customer with caller contact and without edit email', () => {
        val.email = 'John@mailinator.com';
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
});
describe('<NewCaseConnected />', () => {
    const datamock = {
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
    };
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    newCaseInfo.caseDetails.contacts = [];
    newCaseInfo.caseDetails.contacts.push(datamock);
    const onChangeFirstName = sinon.spy();
    const onChangeLastName = sinon.spy();
    const onChangePhone = sinon.spy();
    const onChangeEmail = sinon.spy();
    const onChangeStreet = sinon.spy();
    const onChangeApt = sinon.spy();
    const onChangeZip = sinon.spy();
    const onChangeCity = sinon.spy();
    const onChangeOrderNumber = sinon.spy();
    const onChangeDescription = sinon.spy();
    const handleSubmitForm = sinon.spy();
    const doCreateNewCase = sinon.spy();
    const doUpdateCase = sinon.spy();
    const boolVal = true;
    const wrapperForm = shallow(<NewCase
        isEditCase={boolVal}
        newCaseInfo={newCaseInfo}
        params={{ caseId: 4 }}
        actions={{
            onChangeFirstName,
            doUpdateCase,
            onChangeLastName,
            onChangePhone,
            onChangeEmail,
            onChangeStreet,
            onChangeApt,
            doCreateNewCase,
            onChangeZip,
            onChangeCity,
            onChangeOrderNumber,
            onChangeDescription,
            handleSubmitForm,
        }}/>);
    const val = {
        OrderNumber: 232445,
        firstName: 'raj',
        lastName: 'star',
        phoneNumber: '234 234-2344',
        email: 'raj.jcp@gmail.com',
        streetAddress: 'asd',
        apt: 'wee',
        city: 'chen',
        state: 'qwe',
        zip: '12345',
        priority: '2',
    };
    it('Update case for guest and with modified for priority fioeld', () => {
        wrapperForm.instance().submitCase(val);
    });
    it('Update case for guest and without modified for priority', () => {
        val.priority = 'Low';
        val.apt = 'Center For Financial Assistance To Deposed Nigerian Royalty';
        val.streetAddress = 'Megasystems Inc, Suite 5a-1204';
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
});
describe('<NewCaseConnected />', () => {
    const datamock = {
        id: '1079453232',
        type: 'guest',
        firstName: 'raj',
        lastName: 'star',
        phoneNumber: '2342342344',
        email: 'raj.jcp@gmail.com',
        address1: 'Megasystems Inc, Suite 5a-1204',
        address2: 'Center For Financial Assistance To Deposed Nigerian Royalty',
        city: 'Columbia',
        state: 'Texas',
        country: 'USA',
        zipCode: '85705',
    };
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    newCaseInfo.caseDetails.contacts = [];
    newCaseInfo.caseDetails.contacts.push(datamock);
    const onChangeFirstName = sinon.spy();
    const onChangeLastName = sinon.spy();
    const onChangePhone = sinon.spy();
    const onChangeEmail = sinon.spy();
    const onChangeStreet = sinon.spy();
    const onChangeApt = sinon.spy();
    const onChangeZip = sinon.spy();
    const onChangeCity = sinon.spy();
    const onChangeOrderNumber = sinon.spy();
    const onChangeDescription = sinon.spy();
    const handleSubmitForm = sinon.spy();
    const doCreateNewCase = sinon.spy();
    const doUpdateCase = sinon.spy();
    const boolVal = true;
    const wrapperForm = shallow(<NewCase
        isEditCase={boolVal}
        newCaseInfo={newCaseInfo}
        params={{ caseId: 4 }}
        actions={{
            onChangeFirstName,
            doUpdateCase,
            onChangeLastName,
            onChangePhone,
            onChangeEmail,
            onChangeStreet,
            onChangeApt,
            doCreateNewCase,
            onChangeZip,
            onChangeCity,
            onChangeOrderNumber,
            onChangeDescription,
            handleSubmitForm,
        }}/>);
    const val = {
        OrderNumber: 232445,
        firstName: 'raj',
        lastName: 'star',
        phoneNumber: '234 234-2344',
        email: 'raj.jcp@gmail.com',
        streetAdress: 'asd',
        apt: 'wee',
        city: 'chen',
        state: 'qwe',
        zip: '12345',
    };
    it('checking case component', () => {
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
});
describe('Update case for Registered user', () => {
    const datamock = {
        id: '1079453232',
        type: 'registered',
        firstName: 'raj',
        priority: 'High',
        lastName: 'star',
        phoneNumber: '2342342344',
        email: 'raj.jcp@gmail.com',
        address1: 'Megasystems Inc, Suite 5a-1204',
        address2: 'Center For Financial Assistance To Deposed Nigerian Royalty',
        city: 'Columbia',
        state: 'Texas',
        country: 'USA',
        zipCode: '85705',
    };
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    newCaseInfo.caseDetails.contacts = [];
    newCaseInfo.caseDetails.contacts.push(datamock);
    const onChangeFirstName = sinon.spy();
    const onChangeLastName = sinon.spy();
    const onChangePhone = sinon.spy();
    const onChangeEmail = sinon.spy();
    const onChangeStreet = sinon.spy();
    const onChangeApt = sinon.spy();
    const onChangeZip = sinon.spy();
    const onChangeCity = sinon.spy();
    const onChangeOrderNumber = sinon.spy();
    const onChangeDescription = sinon.spy();
    const handleSubmitForm = sinon.spy();
    const doCreateNewCase = sinon.spy();
    const doUpdateCase = sinon.spy();
    const boolVal = true;
    const wrapperForm = shallow(<NewCase
        isEditCase={boolVal}
        newCaseInfo={newCaseInfo}
        params={{ caseId: 4 }}
        actions={{
            onChangeFirstName,
            doUpdateCase,
            onChangeLastName,
            onChangePhone,
            onChangeEmail,
            onChangeStreet,
            onChangeApt,
            doCreateNewCase,
            onChangeZip,
            onChangeCity,
            onChangeOrderNumber,
            onChangeDescription,
            handleSubmitForm,
        }}/>);
    const val = {
        OrderNumber: 232445,
        firstName: 'raj',
        lastName: 'star',
        phoneNumber: '234 234-2344',
        email: 'raj.jcp@gmail.com',
        streetAdress: 'asd',
        apt: 'wee',
        priority: 'High',
        city: 'chen',
        state: 'qwe',
        zip: '12345',
    };
    it('checking case component', () => {
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        val.priority = 'Low';
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
});
describe('<NewCaseConnected />', () => {
    const newCaseInfo = {
        addCallerContact: false,
        contactAvailable: false,
        contactDetails: null,
        caseDetails: _clone(data),
    };
    newCaseInfo.caseDetails.contacts = [];
    const onChangeFirstName = sinon.spy();
    const onChangeLastName = sinon.spy();
    const onChangePhone = sinon.spy();
    const onChangeEmail = sinon.spy();
    const onChangeStreet = sinon.spy();
    const onChangeApt = sinon.spy();
    const onChangeZip = sinon.spy();
    const onChangeCity = sinon.spy();
    const onChangeOrderNumber = sinon.spy();
    const onChangeDescription = sinon.spy();
    const handleSubmitForm = sinon.spy();
    const doCreateNewCase = sinon.spy();
    const doUpdateCase = sinon.spy();
    const boolVal = true;
    const wrapperForm = shallow(<NewCase
        isEditCase={boolVal}
        newCaseInfo={newCaseInfo}
        params={{ caseId: 4 }}
        actions={{
            onChangeFirstName,
            doUpdateCase,
            onChangeLastName,
            onChangePhone,
            onChangeEmail,
            onChangeStreet,
            onChangeApt,
            doCreateNewCase,
            onChangeZip,
            onChangeCity,
            onChangeOrderNumber,
            onChangeDescription,
            handleSubmitForm,
        }}/>);
    const val = {
        OrderNumber: 232445,
        firstName: 'raj',
        lastName: 'star',
        phoneNumber: '234 234-2344',
        email: 'raj.jcp@gmail.com',
        streetAdress: 'asd',
        apt: 'wee',
        city: 'chen',
        state: 'qwe',
        zip: '12345',
    };
    it('checking case component', () => {
        wrapperForm.instance().submitCase(val);
    });
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
});

it('Componentwillreceiveprops with reinitiate scenario', () => {
    const NewCaseWrapper = new NewCase();

    NewCaseWrapper.props = {
        params: {
            caseId: '234673258475',
        },
        newCaseInfo: {
            updateSuccess: false,
        },
    };
    const nextProps = {
        newCaseInfo: {
            updateSuccess: true,
        },
    };
    NewCaseWrapper.componentWillReceiveProps(nextProps);
});
it('Componentwillreceiveprops with ShowReopen false scenario', () => {
    const newCaseInfo = {
        addCallerContact: true,
        contactAvailable: true,
        caseDetails: _clone(data),
        contactDetails: {
            firstName: 'Richard',
            lastName: 'Marshal',
            phoneNumber: '1231231234',
            email: 'test@test.com',
            address1: '2900',
            address2: 'dallas pkwy',
            city: 'Plano',
            state: 'TX',
            zipCode: '75093',
            id: 430048933,
        },
    };
    const onCloseConfirmModal = sinon.spy();
    const doCreateNewCase = sinon.spy();

    const shallowWrapper = shallow(<NewCase
        newCaseInfo={newCaseInfo}
        actions={{ doCreateNewCase, onCloseConfirmModal }}
        />);
    shallowWrapper.setProps({
        newCaseInfo: {
            updateSuccess: false,
        },
    });
    shallowWrapper.instance().render();
});
