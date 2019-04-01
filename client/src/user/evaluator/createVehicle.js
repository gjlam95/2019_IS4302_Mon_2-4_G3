import React, { Component } from "react";
import { EvaluatorCreateVehicle } from "../../util/APIUtils";
import { Form, Input, Button, notification } from "antd";
import "./Createvehicle.css";

const FormItem = Form.Item;
class Evaluator_createvehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleId: "",
      $class: "",
      vehicleCategory: "",
      brand: "",
      numberPlate: "",
      color: "",
      modelType: "",
      mileage: "",
      transmission: "",
      engineCap: "",
      power: "",
      features: "",
      description: "",
      /*vehicleDetails: {
        vehicleCategory: "",
        brand: "",
        numberPlate: "",
        color: "",
        modelType: "",
        mileage: "",
        transmission: "",
        engineCap: "",
        power: "",
        features: "",
        description: ""
      },
      */
      coe_expiry: "",
      warranty_expiry: "",
      roadtax_expiry: "",
      owner: "",
      middleman: ""
    };
    this.createVehicle = this.createVehicle.bind(this);
    //this.handleMakePayment = this.handleMakePayment.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  createVehicle(event) {
    event.preventDefault();
    const createVehicle = {
      vehicleId: this.state.vehicleId.value,
      vehicleDetails: {
        $class: "org.equiv.VehicleDetails",
        vehicleCategory: this.state.vehicleCategory.value,
        brand: this.state.brand.value,
        modelType: this.state.modelType.value,
        numberPlate: "",
        color: this.state.color.value,
        mileage: this.state.mileage.value,
        transmission: this.state.transmission.value,
        engineCap: this.state.engineCap.value,
        power: this.state.power.value,
        features: this.state.features.value,
        description: this.state.description.value
      },
      coe_expiry: this.state.coe_expiry.value,
      warranty_expiry: this.state.warranty_expiry.value,
      roadtax_expiry: this.state.roadtax_expiry.value,
      owner:
        "resource:org.equiv.participants.assets.Seller#" +
        this.state.owner.value,
      middleman:
        "resource:org.equiv.participants.assets.Middleman#" +
        this.state.middleman.value
    };
    console.log(createVehicle);
    EvaluatorCreateVehicle(createVehicle)
      .then(response => {
        notification.success({
          message: "EquiV",
          description: "Vehicle Has been created!"
        });
        window.location.reload();
      })
      .catch(error => {
        notification.error({
          message: "EquiV",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    this.setState({
      [inputName]: {
        value: inputValue
      }
    });
  }

  render() {
    return (
      <div className="vehicle-container">
        <h1 className="page-title">Create Vehicle</h1>
        <div className="vehicle-content">
          <Form onSubmit={this.createVehicle} className="vehicle-form">
            <FormItem label="Vehicle Name">
              <Input
                size="large"
                name="vehicleId"
                value={this.state.vehicleId.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Vehicle Category">
              <Input
                size="large"
                name="vehicleCategory"
                value={this.state.vehicleCategory.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>

            <FormItem label="Brand">
              <Input
                size="large"
                name="brand"
                value={this.state.brand.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Model Type">
              <Input
                size="large"
                name="modelType"
                value={this.state.modelType.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Color">
              <Input
                size="large"
                name="color"
                value={this.state.color.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Mileage">
              <Input
                size="large"
                name="mileage"
                value={this.state.mileage.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Transmission">
              <Input
                size="large"
                name="transmission"
                value={this.state.transmission.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Engine Cap">
              <Input
                size="large"
                name="engineCap"
                value={this.state.engineCap.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Power">
              <Input
                size="large"
                name="power"
                value={this.state.power.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Features">
              <Input
                size="large"
                name="features"
                value={this.state.features.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Description">
              <Input
                size="large"
                name="description"
                value={this.state.description.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="COE Expiry">
              <Input
                size="large"
                name="coe_expiry"
                value={this.state.coe_expiry.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Warranty Expiry">
              <Input
                size="large"
                name="warranty_expiry"
                value={this.state.warranty_expiry.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Road Tax">
              <Input
                size="large"
                name="roadtax_expiry"
                value={this.state.roadtax_expiry.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Owner of Vehicle">
              <Input
                size="large"
                name="owner"
                value={this.state.owner.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem label="Middleman">
              <Input
                size="large"
                name="middleman"
                value={this.state.middleman.value}
                onChange={event => {
                  this.handleInputChange(event);
                }}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                icon="shrink"
                htmlType="submit"
                size="large"
                className="vehicle-form-button"
              >
                Create Vehicle
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Evaluator_createvehicle;
