<script>
    import { createEventDispatcher } from "svelte";
    import SvelteTooltip from "svelte-tooltip";
    import { onMount } from "svelte";
    import Loading from "./loading.svelte";
    const dispatch = createEventDispatcher();
    export let getData;
    export let userArray;
    export let totalRecords;
    export let pageBlockToShow;
    export let availableRecordPerPage;
    export let searchArray;
    export let counter;

    let loader = true;

    // console.log(totalRecords);
    //page initiation//
    let searchEmail = "";
    const handlePrev = () => {
        dispatch("prev", { message: "prev" });
    };
    const handleNext = () => {
        dispatch("next", { message: "next" });
    };
    const handlePage = (page) => {
        if (page === 0) {
            page = 1;
        } else {
            page = page;
        }
        dispatch("page", page);
    };

    onMount(() => {
        getData();
        setTimeout(() => {
            loader = false;
        }, 800);
    });

    const handleDelete = (id) => {
        console.log(id);
        dispatch("delete", id);
    };
    const handleUpdate = (updateData) => {
        dispatch("update", updateData);
    };
    const handleSearchEvent = () => {
        dispatch("searchEvent", { searchemail: searchEmail });
    };
</script>

{#if loader}
    <span><Loading /></span>
{:else}
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card" />
                <div class="table-responsive">
                    <div class="search-box" style="flex-grow:2;">
                        <div class="input-group">
                            <div class="form-outline">
                                <input
                                    type="Search"
                                    id="form1"
                                    class="form-control"
                                    placeholder="search by email"
                                    style="width:300px;"
                                    bind:value={searchEmail}
                                    on:keypress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearchEvent();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <table
                        class="table table-striped table-hover"
                        style="vertical-align: baseline"
                    >
                        <thead class="table_headings">
                            <tr>
                                <!-- <th scope="col" class="border-0 text-uppercase font-medium pl-4">#</th> -->
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Name</th
                                >
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Email</th
                                >
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Address</th
                                >
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Gender</th
                                >
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Date of Birth</th
                                >
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Contact No</th
                                >
                                <th
                                    scope="col"
                                    class="border-0 text-SentenceCase font-medium"
                                    >Action</th
                                >
                            </tr>
                        </thead>

                        <tbody>
                            {#each userArray as user}
                                <tr class="tr">
                                    <!-- <td class="pl-4">{userArray.length}</td> -->
                                    <td>
                                        <h5 class="font-medium mb-0">
                                            {user.firstname +
                                                " " +
                                                user.lastname}
                                        </h5>
                                    </td>
                                    <td>
                                        <span class="text-muted"
                                            >{user.email}</span
                                        ><br />
                                    </td>
                                    <td
                                        style="column-width: 400px;width: 416px;"
                                    >
                                        <span class="text-muted"
                                            >{user.buildingname +
                                                " " +
                                                " ," +
                                                user.street +
                                                " " +
                                                user.landmark +
                                                "" +
                                                " " +
                                                user.city +
                                                " " +
                                                "," +
                                                user.state +
                                                " " +
                                                user.pincode +
                                                "."}</span
                                        ><br />
                                    </td>
                                    <td>
                                        <span class="text-muted"
                                            >{user.gender}</span
                                        ><br />
                                    </td>
                                    <td>
                                        <span class="text-muted"
                                            >{user.date_of_birth}</span
                                        ><br />
                                    </td>
                                    <td>
                                        <span class="text-muted"
                                            >{user.contactno}</span
                                        ><br />
                                    </td>

                                    <td>
                                        <SvelteTooltip
                                            tip="Edit"
                                            top
                                            color="#ffc107"
                                        >
                                            <a
                                                href="#"
                                                class="settings"
                                                title="Settings"
                                                on:click={handleUpdate(user)}
                                                ><i class="material-icons"
                                                    >&#xE8B8;</i
                                                ></a
                                            >
                                        </SvelteTooltip>

                                        <SvelteTooltip
                                            tip="Delete"
                                            top
                                            color="crimson"
                                        >
                                            <a
                                                href="#"
                                                class="delete"
                                                title="Delete"
                                                on:click={handleDelete(
                                                    user.user_id
                                                )}
                                                ><i class="material-icons"
                                                    >&#xE5C9;</i
                                                ></a
                                            >
                                        </SvelteTooltip>
                                        <!-- <button type="button" class="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"><i class="fa fa-upload"></i> </button> -->
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div>
                    <div class="hint-text">
                        Showing <b>{availableRecordPerPage}</b> out of
                        <b>{totalRecords}</b> entries
                    </div>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination justify-content-end">
                            <li class="page-item">
                                <a
                                    class="page-link"
                                    href="#"
                                    tabindex="-1"
                                    on:click={() => {
                                        handlePrev();
                                        loader = true;
                                        setTimeout(() => {
                                            loader = false;
                                        }, 800);
                                    }}>Previous</a
                                >
                            </li>
                            {#each Array(pageBlockToShow) as pbs, i}
                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        on:click={() => {
                                            handlePage(i);
                                            loader = true;
                                            setTimeout(() => {
                                                loader = false;
                                            }, 800);
                                        }}>{i++ + 1}</a
                                    >
                                </li>
                            {/each}
                            <li class="page-item">
                                <a
                                    class="page-link"
                                    href="#"
                                    on:click={() => {
                                        handleNext();
                                        loader = true;
                                        setTimeout(() => {
                                            loader = false;
                                        }, 800);
                                    }}>Next</a
                                >
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- </div> -->
<style>
    body {
        background: #edf1f5;
        margin-top: 20px;
    }
    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 0 solid transparent;
        border-radius: 0;
    }
    .btn-circle.btn-lg,
    .btn-group-lg > .btn-circle.btn {
        width: 50px;
        height: 50px;
        padding: 14px 15px;
        font-size: 18px;
        line-height: 23px;
    }
    .text-muted {
        color: #8898aa !important;
    }
    [type="button"]:not(:disabled),
    [type="reset"]:not(:disabled),
    [type="submit"]:not(:disabled),
    button:not(:disabled) {
        cursor: pointer;
    }
    .btn-circle {
        border-radius: 100%;
        width: 40px;
        height: 40px;
        padding: 10px;
    }
    .user-table tbody tr .category-select {
        max-width: 150px;
        border-radius: 20px;
    }
    .container {
        margin-left: 5px;
        margin-right: 0px;
        padding-left: 5px;
        padding-right: 5px;
        max-width: none;
    }
    .table_headings {
        display: table-header-group;
        margin-bottom: 3px;
        border-bottom: 2px solid lightgray;
        font-size: 14px;
    }
    .h5,
    h5 {
        font-size: 16px;
    }
    table.table td a:hover {
        color: #2196f3;
    }
    .table-title .btn:hover,
    .table-title .btn:focus {
        color: #566787;
        background: #f2f2f2;
    }
    table.table td a.settings {
        color: #2196f3;
    }
    table.table td a.delete {
        color: #f44336;
    }
    .table-striped > tbody > tr:nth-of-type(odd) {
        --bs-table-accent-bg: #f8f9fa;
        color: var(--bs-table-striped-color);
    }

    table.table-striped.table-hover tbody tr:hover {
        background: #f5f5f5;
    }
    tbody > .tr {
        height: 70px;
    }
    .input-group {
        justify-content: end;
        margin-bottom: 20px;
        margin-top: 20px;
    }
</style>
