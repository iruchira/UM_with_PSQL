<script>
    import Icon from "@iconify/svelte";
    import DisplayUser from "./displayUser.svelte";
    import UserForm from "./userForm.svelte";
    //for toast msg//
    import toast, { Toaster } from "svelte-french-toast";

    let objToUpdate = "";
    let userArray = [];
    let counter = "displayUserList";
    let searchEmail = "";
    let searchArray = [];

    let postData = async (event) => {
        let data = event.detail;
        console.log(data);
        if (
            data.firstname.trim() === "" ||
            data.lastname.trim() === "" ||
            data.email.trim() === "" ||
            data.password.trim() === "" ||
            data.gender.trim() === "" ||
            data.buildingname.trim() === "" ||
            data.street.trim() === "" ||
            data.landmark.trim() === "" ||
            data.state.trim() === "" ||
            data.city.trim() === "" ||
            data.date_of_birth.trim() === "" ||
            data.contactno.trim() === "" ||
            data.pincode.trim() === ""
        ) {
            console.log("data invalid");
        } else {
            try {
                const res = await fetch("http://localhost:3000/user/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        password: data.password,
                        gender: data.gender,
                        buildingname: data.buildingname,
                        street: data.street,
                        landmark: data.landmark,
                        city: data.city,
                        state: data.state,
                        pincode: data.pincode,
                        date_of_birth: data.date_of_birth,
                        contactno: data.contactno,
                    }),
                });
                const response = await res.text();
                //  const data = await response.text();
                console.log(response);
                // isFormEnable = true
                counter = "displayUserList";
                toast.success("user added...");
            } catch (error) {
                console.log("error in writing file...." + error);
            }
        }
    };
    const deleteUserData = async (e) => {
        const res = await fetch(`http://localhost:3000/user/${e.detail}`, {
            method: "DELETE",
        });
        console.log(res);

        const response = await res.text();
        console.log(response);
        var findingId = "";
        for (let i = 0; i < userArray.length; i++) {
            if (userArray[i].id === e.detail) {
                findingId = i;
            }
        }
        userArray.splice(findingId, 1);
        userArray = userArray;
    };

    const updateUser = async (event) => {
        try {
            objToUpdate = event.detail;
            console.log("update user", objToUpdate);
            counter = "updateUserList";
        } catch (error) {
            console.log("error updating obj....");
        }
    };

    const updatedList = async (event) => {
        try {
            //getting the object which we want to update//
            let updatedData = event.detail;
            console.log("updated data", updatedData);
            const response = await fetch(
                `http://localhost:3000/user/${updatedData.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstname: updatedData.firstname,
                        lastname: updatedData.lastname,
                        email: updatedData.email,
                        gender: updatedData.gender,
                        buildingname: updatedData.buildingname,
                        street: updatedData.street,
                        landmark: updatedData.landmark,
                        password: updatedData.password,
                        city: updatedData.city,
                        state: updatedData.state,
                        pincode: updatedData.pincode,
                        date_of_birth: updatedData.date_of_birth,
                        contactno: updatedData.contactno,
                    }),
                }
            );
            const res = response.text();
            console.log(res);
            counter = "displayUserList";
            toast.success("user updated sucessfully...");
        } catch (error) {
            console.log("error while displaying user list");
        }
    };

    //Page initiation//
    $: page = 1;
    let totalRecords = "";
    let availableRecordPerPage = "";
    let pageBlockToShow = "";

    $: pageNumber = (e) => {
        if (e.detail.message === "next" && page < totalRecords) {
            page++;
            getData();
        } else if (
            e.detail.message === "prev" &&
            page > 1 &&
            page <= totalRecords
        ) {
            page--;
            getData();
            console.log("prev pressed");
        } else if (e.detail > 0 && e.detail <= totalRecords) {
            page = e.detail;
            getData();
        }
    };

    const getData = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/user/?page=${page}&limit=2`,
                {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                }
            );
            const dataFromAPI = await res.json();
            console.log(await dataFromAPI);
            userArray = dataFromAPI.data;
            console.log(dataFromAPI);
            totalRecords = dataFromAPI.data.length;
            availableRecordPerPage = userArray.length;
            pageBlockToShow = Math.ceil(totalRecords / 9);
        } catch (e) {
            await console.log("error");
        }
    };

    const searchUserData = async (e) => {
        console.log("searched email", e.detail.searchemail);

        const res = await fetch(
            `http://localhost:3000/user/${e.detail.searchemail}`,
            {
                method: "GET",
                headers: { "content-type": "application/json" },
            }
        );
        const dataFromAPI = await res.json();
        console.log("got the searched data", dataFromAPI);
        searchArray = dataFromAPI;
        // searchArray = searchedUsers;
        // console.log("searchedUsers",searchedUsers);
        totalRecords = searchArray.length;
        availableRecordPerPage = searchArray.length;
        counter = "searchedUser";
    };
</script>

<Toaster />
<main>
    <div class="row">
        <div class="col-sm-3"><h2>User <b>Managment</b></h2></div>
        <div class="col-sm-7" style="flex-grow:4">
            <button
                class="btn btn-secondary"
                on:click={() => {
                    counter = "displayUserList";
                }}
                ><Icon icon="material-symbols:home" inline={true} />
                <span>Home</span></button
            >
            <button
                class="btn btn-secondary"
                on:click={() => {
                    counter = "addUser";
                }}
                ><Icon icon="material-symbols:add-circle" inline={true} />
                <span>Add New User</span></button
            >
        </div>
    </div>
    <div class="s11">
        {#if counter === "displayUserList"}
            <DisplayUser
                {userArray}
                {getData}
                on:delete={deleteUserData}
                on:update={updateUser}
                {availableRecordPerPage}
                {totalRecords}
                {pageBlockToShow}
                on:page={pageNumber}
                on:prev={pageNumber}
                on:next={pageNumber}
                on:searchEvent={searchUserData}
                {searchArray}
                {counter}
            />
        {:else if counter === "addUser"}
            <UserForm on:createInfo={postData} />
        {:else if counter === "updateUserList"}
            <UserForm {objToUpdate} on:update={updatedList} />
        {:else if counter === "searchedUser"}
            <DisplayUser
                userArray={searchArray}
                getData={searchUserData}
                on:delete={deleteUserData}
                on:update={updateUser}
                {availableRecordPerPage}
                {totalRecords}
                {pageBlockToShow}
                on:page={pageNumber}
                on:prev={pageNumber}
                on:next={pageNumber}
                on:searchEvent={searchUserData}
                {searchArray}
                {counter}
            />
        {/if}
    </div>
</main>

<style>
    * {
        margin: 0px;
        padding-top: 0px;
        padding-right: 0px;
        padding-left: 0px;
        padding-bottom: 0px;
    }
    .row {
        box-sizing: border-box;
        font-family: "Varela Round", sans-serif;
        font-size: 13px;
        background-color: #007bff;
        color: white;
        height: 70px;
        align-items: center;
        padding-left: 22px;
    }
    .col-sm-7 {
        justify-content: flex-end;
        display: flex;
    }
    .btn {
        height: 35px;
        padding: 5px;
        border: none;
        outline: none;
        color: #566787;
        background: white;
        margin-right: 20px;
        border-radius: 3%;
        font-weight: 400;
        margin-right: 15px;
    }
    .btn-secondary {
        border-radius: 2px;
        padding: 7px;
        /* margin-right: 5px; */
        margin-left: 6px;
        text-align: center;
        line-height: 1.5;
    }
    .btn-secondary :hover {
        color: #566787;
        background: #f2f2f2;
    }
    .btn:not(:disabled):not(.disabled):hover {
        cursor: pointer;
        background-color: #f8f9fa;
    }
    #addButton {
        margin-right: 10px;
        background: black;
        box-shadow: 0.5px lightgrey;
    }
    .s1 {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        height: 1000px;
        background: white;
    }
    .s10 {
        /* flex-grow:0.5; */
        padding: 2px;
        /* border:1px solid black; */
        border-radius: 2px;
    }
    .s11 {
        display: flex;
        justify-content: center;
        flex-grow: 5;
        padding: 2px;
        /* border:1px solid black; */
        border-radius: 2px;
    }
    #form1 {
        padding: 5px;
        border-radius: 0px;
    }
</style>
