const{
    allServices,createServices, getOneUser,updateServices,deleteServices
}= require("../Services/userServices.js");

exports.viewAllUsers = async(req,res)=>{
    const page= req.query.page;
    const limit = req.query.limit;
    const controllerAdd = await allServices(page,limit);
    console.log(page,limit);
    console.log(controllerAdd)
    res.status(200).send(controllerAdd);
}
exports.getSingleUser=async(req,res)=>{
    console.log(req.params);
    const emailChar = req.params.email;
    const resultFromService= await getOneUser(emailChar);
    if((resultFromService)){
        res.status(200).send(resultFromService);
    }
    else{
        res.status(400).send('No User Found');
    }
}
exports.addUsers = async(req,res)=>{
    const controllerAdd = await createServices(req.body);
    console.log(controllerAdd);
    res.status(200).send(controllerAdd);
    if(controllerAdd.error ){
        res.status(400).send(controllerAdd.error);
    }else if( controllerAdd.success === true){
        res.status(200).send(controllerAdd.body);
}
}
exports.updateUsers= async(req,res)=>{
    const id =req.params.id;
    const body = req.body;
    const controllerAdd = updateServices(id, body);
    if (!controllerAdd) {
        return res.status(404).send(`No user found with ID ${id}`);
      } else {
        return res.send(`User with ID ${id} updated successfully`);
      }
}

exports.deleteUsers =async (req,res)=>{
const id = req.params.id;
const controllerAdd = await  deleteServices(id);
if(!controllerAdd){
return res.status(404).send(`No user found with id ${id}`)
}else{
   return res.send(`user with id ${id} deleted successfully...`)
}

}
