<script>
    import { createEventDispatcher } from "svelte";
    //new instance of createEventDispatcher is created//
    const dispatch = createEventDispatcher();
    export let objToUpdate;
    let data = "";
    let valid = false;
    console.log("objToUpdate", objToUpdate);
    if (objToUpdate === undefined) {
        data = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            buildingname: "",
            street: "",
            landmark: "",
            city: "",
            state: "",
            pincode: "",
            date_of_birth: "",
            contactno: "",
        };
    } else {
        data = {
            id: objToUpdate.user_id,
            firstname: objToUpdate.firstname,
            lastname: objToUpdate.lastname,
            email: objToUpdate.email,
            password: objToUpdate.password,
            gender: objToUpdate.gender,
            buildingname: objToUpdate.buildingname,
            street: objToUpdate.street,
            landmark: objToUpdate.landmark,
            city: objToUpdate.city,
            state: objToUpdate.state,
            pincode: objToUpdate.pincode,
            date_of_birth: objToUpdate.date_of_birth,
            contactno: objToUpdate.contactno,
        };
    }
    //Form validation//
    let NameError = "";
    let lastNameError = "";
    let emailError = "";
    let passwordError = "";
    let conPassError = "";
    let building_noError = "";
    let street1Error = "";
    let landmarkError = "";
    let pincodeError = "";
    let stateError = "";
    let contactNoError = "";
    let genderError = "";
    let cityError = "";
    let handleSubmit = () => {
        valid = true;
        if (
            !data.firstname.match(/^[A-Za-z\s]*$/) ||
            data.firstname.trim() == ""
        ) {
            valid = false;
            NameError = "Firstname must only contain letters";
        } else {
            valid = true;
            NameError = "";
        }

        if (
            data.lastname.trim().length < 1 ||
            !data.lastname.match(/^[A-Za-z\s]*$/)
        ) {
            valid = false;
            lastNameError = "Lastname  must only contain letters";
        } else {
            lastNameError = "";
        }

        if (
            !data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ) {
            valid = false;
            emailError = "Enter valid email address";
        } else {
            emailError = "";
        }
        if (
            !data.password.match(
                /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/
            )
        ) {
            valid = false;
            passwordError =
                "Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols";
        } else {
            passwordError = "";
        }
        if (data.password !== data.confirmPassword) {
            valid = false;
            conPassError = "Passwords do not match";
        } else {
            conPassError = "";
        }

        var option = document.getElementsByName("gender");
        if (!(option[0].checked || option[1].checked || option[2].checked)) {
            valid = false;
            genderError = "Please Select Your Gender";
        } else {
            genderError = "";
        }

        if (
            !data.buildingname.match(/[^a-zA-Z0-9]/) ||
            !data.buildingname.trim() == "" ||
            !data.street.trim().length <= 1 ||
            !data.landmark.trim() == ""
        ) {
            valid = false;
            building_noError = "Enter valid building name or number";
            street1Error = "Enter valid street name";
            landmarkError = "Enter valid landmark";
        } else {
            building_noError = "";
            street1Error = "";
            landmarkError = "";
        }
        if (!data.pincode.match(/[^[0-9]{1,6}$]/)) {
            valid = false;
            pincodeError = "Enter 6 digit number";
        } else {
            pincodeError = "";
        }
        if (!data.city.match(/^[A-Za-z\s]*$/) || data.city.trim() == "") {
            valid = false;
            cityError = "City must only contain letters";
        } else {
            cityError = "";
        }
        if (data.state.trim() == "") {
            valid = false;
            stateError = "* Required";
        } else {
            cityError = "";
        }
        if (data.contactno.trim() == "") {
            valid = false;
            contactNoError = "Contact no must contain 10 digits";
        } else {
            contactNoError = "";
        }

        if (objToUpdate === undefined) {
            dispatch("createInfo", data);
        } else {
            console.log("data :", data);
            dispatch("update", data);
        }
    };
</script>

<section>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>The Easiest Way to Add Input Masks to Your Forms</title>
</section>

<div class="container-lg">
    <form class="row g-2">
        <div class="form-icon" />
        <div class="col-md-6">
            <label for="firstname" class="labels">Firstname :</label>
            <input
                title="name"
                autocomplete="off"
                type="text"
                class="form-control item"
                id="firstName"
                placeholder="Firstname"
                bind:value={data.firstname}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={NameError}
            >
                {NameError}
            </span>
        </div>
        <div class="col-md-6">
            <label for="Lastname" class="labels">Lastname :</label>
            <input
                type="text"
                class="form-control item"
                id="lastName"
                placeholder="Lastname"
                bind:value={data.lastname}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={lastNameError}
            >
                {lastNameError}
            </span>
        </div>
        <div class="col-md-12">
            <label for="email" class="labels">Email :</label>
            <input
                type="email"
                class="form-control item"
                id="email"
                placeholder="Email"
                bind:value={data.email}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={emailError}
            >
                {emailError}
            </span>
        </div>
        <div class="col-md-6">
            <label for="Password" class="labels">Password :</label>
            <input
                type="password"
                class="form-control item"
                id="password"
                placeholder="Password"
                bind:value={data.password}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={passwordError}
            >
                {passwordError}
            </span>
        </div>
        <div class="col-md-6">
            <label for="Cpassword" class="labels">Confirm Password :</label>
            <input
                type="password"
                class="form-control item"
                id="Confpassword"
                placeholder="Confirm Password"
                bind:value={data.confirmPassword}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={conPassError}
            >
                {conPassError}
            </span>
        </div>
        <div class="col-md-4">
            <label
                for="Select gender "
                class="labels"
                style="  margin-top: 30px; ">Select Gender :</label
            >
            <!-- <label for="gender">Gender<span class="req">*</span></label> -->
            <input
                type="radio"
                value="Male"
                name="gender"
                bind:group={data.gender}
                id="check"
            />
            Male
            <input
                type="radio"
                value="Female"
                name="gender"
                bind:group={data.gender}
                id="check1"
            />
            Female
            <input
                type="radio"
                value="Other"
                name="gender"
                bind:group={data.gender}
                id="check3"
            />
            Other <br />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={genderError}>{genderError}</span
            >
        </div>
        <div class="col-md-4">
            <label for="Date" class="labels">Date :</label>
            <input
                type="date"
                class="form-control item"
                id="dateOfBirth"
                placeholder="D.O.B : dd-mm-yy"
                bind:value={data.date_of_birth}
                min="1980-01-01"
                max="2010-12-31"
            />
            <span class="errorDiv" />
        </div>
        <div class="col-md-4">
            <label for="Contact No " class="labels">Contact No :</label>
            <input
                type="text"
                id="contactNo"
                class="form-control item"
                bind:value={data.contactno}
                placeholder="Contact No"
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={contactNoError}>{contactNoError}</span
            >
        </div>
        <div class="col-md-4">
            <label for="Building No" class="labels">Building No/Name :</label>
            <input
                type="text"
                class="form-control item"
                placeholder="Building Name/No"
                bind:value={data.buildingname}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={building_noError}>{building_noError}</span
            >
        </div>
        <div class="col-md-4">
            <label for="Street 1" class="labels">Street 1</label>
            <input
                type="text"
                class="form-control item"
                placeholder="Street 1"
                bind:value={data.street}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={street1Error}>{street1Error}</span
            >
        </div>
        <div class="col-md-4">
            <label for="Landmark" class="labels">Landmark :</label>
            <input
                type="text"
                class="form-control item"
                id="landmark"
                placeholder="Landmark"
                bind:value={data.landmark}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={landmarkError}>{landmarkError}</span
            >
        </div>
        <div class="col-md-4">
            <label for="State" class="labels">State :</label>
            <select
                type="State"
                class="form-control item"
                id="state"
                placeholder="State"
                bind:value={data.state}
                ><option value="" disabled selected>Select your State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Andaman and Nicobar Islands"
                    >Andaman and Nicobar Islands</option
                >
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadar and Nagar Haveli"
                    >Dadar and Nagar Haveli</option
                >
                <option value="Daman and Diu">Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
            </select>
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={stateError}>{stateError}</span
            >
        </div>
        <div class="col-md-4">
            <label for="City" class="labels">City :</label>
            <input
                type="text"
                class="form-control item"
                placeholder="City"
                bind:value={data.city}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={cityError}>{cityError}</span
            >
        </div>
        <div class="col-md-4">
            <label for="Pin code" class="labels">PIN Code :</label>
            <input
                type="text"
                class="form-control item"
                placeholder="PIN Code"
                bind:value={data.pincode}
            />
            <span
                class="errorDiv"
                contenteditable="false"
                bind:innerHTML={pincodeError}>{pincodeError}</span
            >
        </div>

        <div class="form-group">
            <button
                type="button"
                class="btn btn-success create-account"
                id="submitButton"
                on:click={handleSubmit}>Create Account</button
            >
        </div>
    </form>
</div>

<style>
    body {
        background-color: #dee9ff;
    }

    .registration-form {
        padding: 50px 0;
        width: 600px;
    }

    .registration-form form {
        background-color: #fff;
        /* max-width: 600px; */
        margin: auto;
        padding: 50px 70px;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.075);
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
        color: #9fadca;
        /* border-top: 1px solid #dee9ff; */
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.075);
    }

    .registration-form .form-icon {
        text-align: center;
        background-color: #5891ff;
        border-radius: 50%;
        font-size: 40px;
        color: white;
        width: 100px;
        height: 100px;
        margin: auto;
        margin-bottom: 50px;
        line-height: 100px;
    }

    .registration-form .item {
        border-radius: 20px;
        margin-bottom: 0px;
        padding: 10px 20px;
    }

    .registration-form .create-account {
        border-radius: 30px;
        padding: 10px 20px;
        font-size: 18px;
        font-weight: bold;
        background-color: #5791ff;
        border: none;
        color: white;
        margin-top: 20px;
    }
    .registration-form .social-icons {
        margin-top: 30px;
        margin-bottom: 16px;
    }

    .registration-form .social-icons a {
        font-size: 23px;
        margin: 0 3px;
        color: #5691ff;
        border: 1px solid;
        border-radius: 50%;
        width: 45px;
        display: inline-block;
        height: 45px;
        text-align: center;
        background-color: #fff;
        line-height: 45px;
    }

    .errorDiv {
        /* margin-left:0 px; */
        /* padding-left: 20px; */
        display: inline-block;
        color: red;
        margin-bottom: 3px;
        margin-top: 0px;
        font-size: 12px;
    }

    .registration-form .social-icons a:hover {
        text-decoration: none;
        opacity: 0.6;
    }
    .valid {
        border-color: 2px solid green;
    }
    .invalid {
        border-color: red;
    }
    .container-lg {
        /* border: 2px solid grey; */
        padding: 30px;
        border-radius: 5px;
        /* box-shadow: 2px solid grey; */
    }
    .labels {
        display: inline-block;
        font-weight: 500;
        margin-bottom: 10px;
    }

    @media (max-width: 576px) {
        .registration-form form {
            padding: 50px 20px;
        }
        .registration-form .form-icon {
            width: 70px;
            height: 70px;
            font-size: 30px;
            line-height: 70px;
        }
    }
</style>
