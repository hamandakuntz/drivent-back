import PasswordRecovery from "@/entities/PasswordRecovery";
import User from "@/entities/User";
import InvalidEmailError from "@/errors/InvalidEmail";
import sgMail from "@sendgrid/mail";
import PasswordRecoveryInterface from "@/interfaces/passwordRecovery";
import UnauthorizedError from "@/errors/Unauthorized";

export async function createNewRecovery(recoveryData: string) {
  const existingUser = await User.findOne({ email: recoveryData } );

  if(!existingUser) {
    throw new InvalidEmailError(recoveryData);
  }

  const user = await PasswordRecovery.createNew(recoveryData); 
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: `${recoveryData}`,
    from: "driventg4@hotmail.com", 
    subject: "Link de recuperação de senha",
    text: "Link de recuperação de senha",
    html: `Olá! Clique nesse <a href="${process.env.LINK}/forgetpassword/${user.token}">link</a> recuperar sua senha.    
    `,
  };
    
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {      
      if (error.response) {
        throw new UnauthorizedError;
      }
    }
  })();
  return user; 
}

export async function getRecoveryInfo(token: string) {
  return await PasswordRecovery.getPasswordRecovery(token);
}

export async function setNewPassword(passwordData: PasswordRecoveryInterface) {
  return await User.setNewPassword(passwordData);
}

export async function checkIfTokenIsExpired(token: string) {
  const isExpired = await PasswordRecovery.checkIfTokenIsExpired(token);
  if(isExpired > 5) {
    return false;
  } else {
    return true;
  }
}
