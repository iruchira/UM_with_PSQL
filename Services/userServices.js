const { response } = require("express");
const express = require("express");
const bcrypt = require('bcrypt');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'usermanagment',
  password: 8999155328,
  post: 5432,
})

exports.allServices = async (page) => {
  console.log(page)
  const limit = 1;
  var offset = (page - 1) * limit;
  const results = await pool.query(`SELECT project.basicDetails.user_id,project.basicDetails.firstname,project.basicDetails.lastname,project.basicDetails.gender,project.basicDetails.date_of_birth,project.basicDetails.contactno,project.loginDetails.log_id,project.loginDetails.email,project.loginDetails.password,project.loginDetails.user_id,project.ResidentialDetails.add_id,project.ResidentialDetails.buildingname,project.ResidentialDetails.street,project.ResidentialDetails.landmark,project.ResidentialDetails.pincode,project.ResidentialDetails.log_id,project.stateDetails.stateadd_id,project.stateDetails.state,project.stateDetails.city,project.stateDetails.add_id FROM project.basicDetails INNER JOIN project.loginDetails ON project.basicDetails.user_id = project.loginDetails.user_id INNER JOIN project.ResidentialDetails ON project.loginDetails.log_id = project.ResidentialDetails.log_id INNER JOIN project.stateDetails ON project.ResidentialDetails.add_id = project.stateDetails.add_id where project.basicDetails.user_delete='0' limit ${limit} offset ${offset}`);

  console.log(results.rows);
  return results.rows;
};

exports.getOneUser = async (emailChar) => {
  const result = await pool.query(`SELECT project.basicDetails.user_id,project.basicDetails.firstname,project.basicDetails.lastname,project.basicDetails.gender,project.basicDetails.date_of_birth,project.basicDetails.contactno,project.loginDetails.log_id,project.loginDetails.email,project.loginDetails.password,project.loginDetails.user_id,project.ResidentialDetails.add_id,project.ResidentialDetails.buildingname,project.ResidentialDetails.street,project.ResidentialDetails.landmark,project.ResidentialDetails.pincode,project.ResidentialDetails.log_id,project.stateDetails.stateadd_id,project.stateDetails.state,project.stateDetails.city,project.stateDetails.add_id FROM project.basicDetails INNER JOIN project.loginDetails ON project.basicDetails.user_id = project.loginDetails.user_id INNER JOIN project.ResidentialDetails ON project.loginDetails.log_id = project.ResidentialDetails.log_id INNER JOIN project.stateDetails ON project.ResidentialDetails.add_id = project.stateDetails.add_id WHERE project.loginDetails.email LIKE '%${emailChar}%' AND project.basicDetails.user_delete='0' `)
  console.log("email result:",result.rows[0]);
  return result.rows[0];};

exports.createServices = async (user) => {
console.log("hello", user);
  const client = await pool.connect();
  if(user.firstname == "" || user.lastname == "" || user.email == "" || user.password == "" || user.gender == "" ||user.date_of_birth == "" ||user.contactno == "" || user.buildingname == "" || user.street == "" || user.landmark =="" || user.pincode == "" || user.state == "" || user.city == ""){
    return {error : "enter valid data"};
  }
 else{
  try {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    await client.query("BEGIN");
    const InsertBasicDetails = await client.query(`INSERT INTO project.basicDetails(firstname,lastname,gender,date_of_birth,contactno) VALUES ('${user.firstname}','${user.lastname}','${user.gender}','${user.date_of_birth}','${user.contactno}') returning user_id`);
    const InsertLoginDetails = await client.query(`INSERT INTO project.loginDetails (email,password,user_id) VALUES ('${user.email}','${user.password}','${InsertBasicDetails.rows[0].user_id}') returning log_id`);
    const InsertResidentialDetails = await client.query(`INSERT INTO project.ResidentialDetails(buildingname,street,landmark,pincode,log_id) VALUES ('${user.buildingname}','${user.street}','${user.landmark}','${user.pincode}','${InsertLoginDetails.rows[0].log_id}')returning add_id`);
    const InsertStateDetails = await client.query(`INSERT INTO project.stateDetails(state,city,add_id) VALUES ('${user.state}','${user.city}','${InsertResidentialDetails.rows[0].add_id}')`);
    await client.query("COMMIT");
    console.log(InsertStateDetails);
    // return await InsertStateDetails;
    return {success: true};
  } catch (e) {
    await client.query("ROLLBACK")
    throw e;
  }
  finally {
    client.release();
  }
}
};

  
exports.updateServices = async (id,body)=>{
  console.log(id)
  const {
    firstname,
    lastname,
    gender,
    date_of_birth,
    email,
    password,
    buildingname,
    contactno,
    street,
    landmark,
    pincode,
    state,
    city,
  }=body;
const isUserExist = await pool.query(`SELECT *FROM project.basicDetails WHERE user_id = '${id}'`);
if(isUserExist.rowCount === 0){
 return false;
}else{
  const client = await pool.connect();
  try{
    await client.query("BEGIN");
    const updateBasicDetails= await client.query(`UPDATE project.basicDetails set firstname ='${firstname}', lastname= '${lastname}',gender='${gender}',date_of_birth='${date_of_birth}',contactno='${contactno}' WHERE user_id='${id}' returning user_id`);
    const updateLoginDetails = await client.query(`UPDATE project.loginDetails set email ='${email}', password= '${password}'  WHERE user_id='${updateBasicDetails.rows[0].user_id}' returning log_id`);
    const updateResDetails = await client.query(`UPDATE project.ResidentialDetails set buildingname ='${buildingname}', street= '${street}', landmark = '${landmark}',pincode='${pincode}' WHERE log_id='${updateLoginDetails.rows[0].log_id}' returning add_id`);
    const updatestateDetails = await client.query(`UPDATE project.stateDetails set state ='${state}', city= '${city}' WHERE add_id='${updateResDetails.rows[0].add_id}'`);
    await client.query("COMMIT");
    console.log(updateBasicDetails);
    return true;
  }catch(e){
  await client.query("ROLLBACK");
  throw e;
  }finally {
    client.release();
  }
  }
};

exports.deleteServices = async(id)=>{
  const isUserExist = await pool.query(`SELECT *FROM project.basicDetails WHERE user_id = '${id}'`);
  if(isUserExist.rowCount === 0){
  return false;
}else{
  const client = await pool.connect();
  console.log(id);
  const result = await client.query(`UPDATE project.basicDetails set user_delete='1' WHERE user_id= '${id}'`)
  console.log(result);
  return true;
}
}