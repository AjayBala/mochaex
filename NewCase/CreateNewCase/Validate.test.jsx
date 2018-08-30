import { expect } from 'chai';
import validate, { normalizePhone, restrictmaxLength, normalizeZip } from './Validate';

it('validate', () => {
    const modelObj = {
        caseInfo: {
            contactAvailable: true,
        },
    };
    const userObj = {
        firstName: 'Ram',
        lastName: 'venky',
        phoneNumber: '8888888888',
        email: 'ram@gmail.com',
        streetAddress: '525,Lincoln street,New York',
        apt: 'Apt',
        zip: '6666',
        city: 'New York',
        order: '11111111',
        desc: 'TestingTestingTestingTestingTestingTestingTestingTestingTestingTesting',
        caseType: 'CCR PENDING',
        priority: 'Low',
    };
    validate(userObj, modelObj);
});
it('validate', () => {
    const modelObj = {
        caseInfo: {
            contactAvailable: true,
        },
    };
    const userObj = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '.com',
        streetAddress: '',
        apt: 'a',
        zip: '',
        city: 'er',
        order: 'fdgs',
        desc: 'sting',
        caseType: '',
        priority: '',
    };
    validate(userObj, modelObj);
});
describe('Test suits for <Validate/>', () => {
    const modelObj = {
        caseInfo: {
            contactAvailable: true,
        },
    };
    it('validate', () => {
        const userObj = {
            firstName: 'Ram',
            lastName: 'venky',
            phoneNumber: '8888888888',
            email: 'ram@gmail.com',
            streetAddress: '525,Lincoln street,New York',
            apt: 'Apt',
            zip: '6666',
            city: 'New York',
            order: '11111111',
            desc: 'TestingTestingTestingTestingTestingTestingTestingTestingTestingTesting',
            caseType: 'CCR PENDING',
            priority: 'Low',
        };
        validate(userObj, modelObj);
    });

    it('Should be check 10 digits number', () => {
        const val = '6756768687';
        const zipError1 = normalizePhone(val, '675676868');
        expect(zipError1).to.equal('675 676-8687');
    });
    it('Should be check 2 digits number', () => {
        const val = '674';
        const zipError1 = normalizePhone(val, '67');
        expect(zipError1).to.equal('674 ');
    });
    it('Should be check 2 digits number', () => {
        const val = '674111';
        const zipError1 = normalizePhone(val, '6711');
        expect(zipError1).to.equal('674 111-');
    });
    it('Should be check 2 digits number', () => {
        const val = '67';
        const zipError1 = normalizePhone(val, '67');
        expect(zipError1).to.equal('67');
    });
    it('Should be check 6 digits number', () => {
        const val = '672299';
        const zipError1 = normalizePhone(val, '672299');
        expect(zipError1).to.equal('672 299');
    });
    it('Should be check 6 digits number', () => {
        const val = '';
        const zipError1 = normalizePhone(val, '');
        expect(zipError1).to.equal('');
    });
    it('Should be check 5 digits number', () => {
        const val = '67567';
        const zipError1 = normalizeZip(val, '67567');
        expect(zipError1).to.equal('67567');
    });
    it('Empty case for zip', () => {
        const val = '';
        const zipError1 = normalizeZip(val, '');
        expect(zipError1).to.equal('');
    });
    it('Should be called streetAddress with minum 15 charactors error', () => {
        const userObj = {
            streetAddress: '525, Lincoln',
        };
        expect(validate(userObj, modelObj).streetAddress).to.equal('Street should contain minimum 15 characters');
    });
    it('Should be called City should contain minimum 4 characters error', () => {
        const userObj = {
            city: 'new',
        };
        expect(validate(userObj, modelObj).city).to.equal('City should contain minimum of 4 characters');
    });
    it('Should be called Order Number should contain numeric only error', () => {
        const userObj = {
            order: 'ord',
        };
        expect(validate(userObj, modelObj).order).to.equal('Order Number should contain numeric only');
    });
    it('Should be check 6 digits number', () => {
        const val = 'testing messages';
        const maxChars = restrictmaxLength(val, 7, 'city');
        expect(maxChars).to.equal('testing');
    });
});
