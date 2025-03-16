import mongoose from "mongoose";

export const ConnectDB = async () => {
  await mongoose.connect("mongodb+srv://yatharth:yatharth@cluster0.queta.mongodb.net/eatzze-test?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("DB Connected"))
}