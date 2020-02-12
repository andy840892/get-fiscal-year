import fiscalData from './fiscal-data.js';

export default class GetFiscalYear {
	constructor() {
		this.currentDate = new Date();
		this.userLocation = null;
	}

	/**
	 * This take a message and logs an error to the console
	 * @param {string} message This is the error message displayed to users
	 */
	_error(message) {
		console.error(`GetFiscalYear: ${message}`);
	}

	/**
	 * This takes the country and the period and returns
	 * @param {string} country This is the country the user would like fiscal year data on
	 * @param {string} period This is the fiscal year time period valid options are 'last', 'next', 'current'
	 * @result The fiscal year data
	 */
	getFiscalYear(country, period = 'current') {
		if (country) {
			return this['_' + period + 'FiscalYear'](this._getCountryInfo(country));
		} else {
			this._error('No country provided.');
			return;
		}
	}

	/**
	 * This takes in the country the user input and matches the data to the fiscalData
	 * @param {string} country: The country the user inputted
	 * @returns {object} The correct country information from fiscalData
	 */
	_getCountryInfo(country) {
		// check to see if country is a country code
		if (country.split('').length > 2) {
			let c = country.toLowerCase();
			// filter fiscalData by country name and return the value
			return fiscalData.filter(x => x.country.toLowerCase().includes(c))[0];
		} else {
			// filter fiscalData by the country code and return the value
			return fiscalData.filter(x => x.code === country)[0];
		}
	}

	/**
	 * This function appends a leading zero
	 * @param {number} number
	 * @returns {string}
	 */
	_appendLeadingZero(number) {
		if (number <= 9) {
			return `0${number}`;
		} else {
			return number;
		}
	}

	/**
	 * This returns the date breakdown as a usable object
	 * @param {string} country The country from the fiscalData
	 * @returns {object}
	 */
	_getDateBreakdown(country) {
		return {
			fs: {
				month: Number(country.fiscalStart.split('/')[0]),
				day: Number(country.fiscalStart.split('/')[1])
			},
			fe: {
				month: Number(country.fiscalEnd.split('/')[0]),
				day: Number(country.fiscalEnd.split('/')[1])
			}
		};
	}

	/**
	 * Returns last fiscal year data
	 * @param {string} country from the fiscalData
	 * @returns {object}
	 */
	_lastFiscalYear(country) {
		const breakdown = this._getDateBreakdown(country);
		if (this.currentDate.getMonth() + 1 < breakdown.fe.month) {
			return {
				period: 'last',
				fiscalYearStart: `${this.currentDate.getFullYear() - 2}/${this._appendLeadingZero(
					breakdown.fs.month
				)}/${this._appendLeadingZero(breakdown.fs.day)}`,
				fiscalYearEnd: `${this.currentDate.getFullYear() - 1}/${this._appendLeadingZero(
					breakdown.fe.month
				)}/${this._appendLeadingZero(breakdown.fe.day)}`
			};
		} else {
			return {
				period: 'last',
				fiscalYearStart: `${this.currentDate.getFullYear() - 1}/${this._appendLeadingZero(
					breakdown.fs.month
				)}/${this._appendLeadingZero(breakdown.fs.day)}`,
				fiscalYearEnd: `${this.currentDate.getFullYear()}/${this._appendLeadingZero(
					breakdown.fe.month
				)}/${this._appendLeadingZero(breakdown.fe.day)}`
			};
		}
	}

	/**
	 * Returns current fiscal year data
	 * @param {string} country from the fiscalData
	 * @returns {object}
	 */
	_currentFiscalYear(country) {
		const breakdown = this._getDateBreakdown(country);
		if (this.currentDate.getMonth() + 1 < breakdown.fe.month) {
			return {
				period: 'current',
				fiscalYearStart: `${this.currentDate.getFullYear() - 1}/${this._appendLeadingZero(
					breakdown.fs.month
				)}/${this._appendLeadingZero(breakdown.fs.day)}`,
				fiscalYearEnd: `${this.currentDate.getFullYear()}/${this._appendLeadingZero(
					breakdown.fe.month
				)}/${this._appendLeadingZero(breakdown.fe.day)}`
			};
		} else {
			return {
				period: 'current',
				fiscalYearStart: `${this.currentDate.getFullYear()}/${this._appendLeadingZero(
					breakdown.fs.month
				)}/${this._appendLeadingZero(breakdown.fs.day)}`,
				fiscalYearEnd: `${this.currentDate.getFullYear() + 1}/${this._appendLeadingZero(
					breakdown.fe.month
				)}/${this._appendLeadingZero(breakdown.fe.day)}`
			};
		}
	}

	/**
	 * Returns next fiscal year data
	 * @param {string} country from the fiscalData
	 * @returns {object}
	 */
	_nextFiscalYear(country) {
		const breakdown = this._getDateBreakdown(country);
		if (this.currentDate.getMonth() + 1 < breakdown.fe.month) {
			return {
				period: 'next',
				fiscalYearStart: `${this.currentDate.getFullYear()}/${this._appendLeadingZero(
					breakdown.fs.month
				)}/${this._appendLeadingZero(breakdown.fs.day)}`,
				fiscalYearEnd: `${this.currentDate.getFullYear() + 1}/${this._appendLeadingZero(
					breakdown.fe.month
				)}/${this._appendLeadingZero(breakdown.fe.day)}`
			};
		} else {
			return {
				period: 'next',
				fiscalYearStart: `${this.currentDate.getFullYear() + 1}/${this._appendLeadingZero(
					breakdown.fs.month
				)}/${this._appendLeadingZero(breakdown.fs.day)}`,
				fiscalYearEnd: `${this.currentDate.getFullYear() + 2}/${this._appendLeadingZero(
					breakdown.fe.month
				)}/${this._appendLeadingZero(breakdown.fe.day)}`
			};
		}
	}
}
