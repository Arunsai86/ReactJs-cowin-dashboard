import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiLoadingStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationDataList: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
    apiStatus: apiLoadingStatus.initial,
  }

  componentDidMount() {
    this.getCowinData()
  }

  onSuccessApiData = responseAry => {
    const lastSevenDaysVaccination = responseAry.last_7_days_vaccination
    const vaccinationByAgeRes = responseAry.vaccination_by_age
    const vaccinationByGenderRes = responseAry.vaccination_by_gender
    const UpdatedData = lastSevenDaysVaccination.map(each => ({
      vaccineDate: each.vaccine_date,
      dose1: each.dose_1,
      dose2: each.dose_2,
    }))
    this.setState({
      vaccinationDataList: UpdatedData,
      vaccinationByAge: vaccinationByAgeRes,
      vaccinationByGender: vaccinationByGenderRes,
      apiStatus: apiLoadingStatus.success,
    })
  }

  getCowinData = async () => {
    this.setState({
      apiStatus: apiLoadingStatus.inProgress,
    })
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccessApiData(data)
    } else {
      this.setState({
        apiStatus: apiLoadingStatus.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {
      vaccinationDataList,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state
    return (
      <>
        <VaccinationCoverage data={vaccinationDataList} />

        <VaccinationByGender data={vaccinationByGender} />

        <VaccinationByAge data={vaccinationByAge} />
      </>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="title">Something went wrong</h1>
    </div>
  )

  renderCowinDashboard = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiLoadingStatus.success:
        return this.renderSuccessView()
      case apiLoadingStatus.inProgress:
        return this.renderLoaderView()
      case apiLoadingStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo-size"
          />
          <h1 className="logo-heading">Co-WIN</h1>
        </nav>
        <h1 className="title">CoWIN Vaccination in India</h1>
        {this.renderCowinDashboard()}
      </div>
    )
  }
}
export default CowinDashboard
