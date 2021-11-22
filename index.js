const Discord = require("discord.js");
const client = new Discord.Client();
const get = require('axios');
const mysql = require('mysql');
var req = require("request");





///////////// CONFIG BESOIN BUTTON ROLE ---> START /////////////////////

// require dotenv package
require('dotenv').config();
// require Nuggies package
const Nuggies = require('nuggies');
// require discord-buttons package
require('discord-buttons')(client);
const fs = require('fs');

///////////// CONFIG BESOIN BUTTON ROLE ---> END /////////////////////

const variables = require(`./variables/variables.json`);
const emoji = require(`./variables/emoji.json`);

// NE PAS TOUCHER ICI !

const prefix = variables.prefix;
const nbr1 = variables.nbr1

// NE PAS TOUCHER ICI !

////////////////////// Language ---> START //////////////////////////////

// NE PAS TOUCHER ICI !
// ALLER DANS LE FICHIER LANGUAGE PUIS FR ET COLLER LES DOSSIERS DE VOTRE LANGAGE DEDANS
// Ce bot à étais repris de celui que j'avais fait, il y a donc pas toute les traductions an Anglais.
// Tout est bien traduit en Francais.

const language = require(`./language/fr/info-app.json`);
const language1 = require(`./language/fr/buttonrole.json`);
const language2 = require(`./language/fr/redeem.json`);
const language3 = require(`./language/fr/forgot.json`);
const language4 = require(`./language/fr/new-hwid.json`);
const language5 = require(`./language/fr/set-hwid.json`);

// NE PAS TOUCHER ICI !
// ALLER DANS LE FICHIER LANGUAGE PUIS FR ET COLLER LES DOSSIERS DE VOTRE LANGAGE DEDANS
// Ce bot à étais repris de celui que j'avais fait, il y a donc pas toute les traductions an Anglais.
// Tout est bien traduit en Francais.

////////////////////// Language ---> END //////////////////////////////

////////////////////// CHANNEL ID ---> START //////////////////////////////
const ChannelRedeem = variables.channelredeem;
////////////////////// CHANNEL ID ---> END //////////////////////////////

////////////////////// AUTH.GG ---> START //////////////////////////////

// NE PAS TOUCHER ICI !
// ALLER DANS LE FICHIER VARIABLE.JSON POUR MODIFIER VOS INFORMATION !

var aid = variables.aid; // AID AUTH.GG 
var secret = variables.secret; // SECRETKEY AUTH.GG 
var apikey = variables.apikey; // APIKEY AUTH.GG 
const API = variables.API; // API FREE  (REGLAGE DE L'API AUTH.GG POUR GERER L'APP DEPUIS DISCORD) :)

// NE PAS TOUCHER ICI !
// ALLER DANS LE FICHIER VARIABLE.JSON POUR MODIFIER VOS INFORMATION !

////////////////////// AUTH.GG ---> END //////////////////////////////


////////////////////// Role Crypt ---> START //////////////////////////////

const CryptRole = require(`./variables/role.json`);

// Ajout des variables pour les roles.

var AdminRole = CryptRole.admin; // Role pour les admins.
var privaterole = CryptRole.priver; // Role priver (utilisateur priver).
var Blanchisseur = CryptRole.Blanchisseur; // ID Role Blanchisseur.


////////////////////// Role Crypt ---> END //////////////////////////////



client.on('ready',() => 
{
	console.log(`- ${client.user.tag} prêt a être utilisé ...\n`)
});



///////////////////////////////////////////////////////////////////
///////////// COMMANDE BUTTON ROLE ---> START /////////////////////
///////////////////////////////////////////////////////////////////



client.on('clickButton', button => {
	Nuggies.buttonroles.buttonclick(client, button);
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
	if (err) console.log(err);
	const file = files.filter(f => f.split('.').pop() === 'js');
	if (file.length < 1) {
		console.log('No Commands.');
		return;
	}
	file.forEach(f => {
		const pull = require(`./commands/${f}`);
		client.commands.set(pull.config.name, pull);
		pull.config.aliases.forEach(aliases => client.aliases.set(aliases, pull.config.name));
	});
});

client.on('message', async message => {
	

	//----------------------------------------------------------------
	//----------------------------------------------------------------
	if (message.author.bot || message.channel.type === 'dm') return;
	if (message.content.startsWith(prefix)) {
		const messageArray = message.content.split(' ');
		const cmd = messageArray[0]
		const args = messageArray.slice(1);
		const command = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
		if (command) {
			if (!command.config.botPerms) return console.log(`${language1.text}`);
			if (!Array.isArray(command.config.botPerms)) return console.log(`${language1.text1}`);
			if (!command.config.userPerms) return console.log(`${language1.text2}`);
			if (!Array.isArray(command.config.userPerms)) return console.log(`${language1.text3}`)
			if (!message.guild.me.hasPermission(command.config.botPerms)) {
				const beauty = command.config.botPerms.join('\`, \`');
				const noBotPerms = new Discord.MessageEmbed()
					.setTitle(`${language1.text4}`)
					.setDescription(`${language1.text5}: \`${beauty}\`.`)
					.setColor('RED');
				return message.channel.send(noBotPerms)
			}
			if (!message.member.hasPermission(command.config.userPerms)) {
				const beauty = command.config.userPerms.join('\`, \`');
				const noUserPerms = new Discord.MessageEmbed()
					.setTitle(`${language1.text6}`)
					.setDescription(`${language1.text7}: \`${beauty}\`.`)
					.setColor('RED');
				return message.channel.send(noUserPerms)
			}

			command.run(client, message, args);
		}
	}
});

///////////////////////////////////////////////////////////////////
///////////// COMMANDE BUTTON ROLE ---> END /////////////////////
///////////////////////////////////////////////////////////////////


client.on('message', async function(message) {
   

		 ////////////////////////////////////
		/// REDEEM Commande (Work 100%) ////
	   ////////////////////////////////////
       	   if(message.content.startsWith(prefix + "redeem")) {
        if(message.channel.id != ChannelRedeem)
        {
            message.delete(message.author);
        } 
        else 
        {

		message.delete(message.author);
		// Arguments pour la clé
		let content = message.content.split(" ");
		let args = content.slice(1);
		const redeemkey = args.join(" ");
		if(!redeemkey) 
		{
            message.author.send(`${message.author}, ${language2.text1}  ${emoji.no}...`)
            .catch(error => message.channel.send(`${variables.errordm}`)
            .then(m => m.delete({timeout: 8000})));
			return;
            
		}
		
		// Debut du check
	 //===============================
					// Verification de la clé par l'api 
get(`https://developers.auth.gg/LICENSES/?type=fetch&authorization=${API}&license=${redeemkey}`, 
{
    headers: 
    {
        'Content-Type': "application/json",
    }
}).then( (res) => 
{

    try 
    {
        // Si elle n'existe pas 
        if(`${res.data.license}` === "undefined")
        {
            message.author.send(`${message.author}, ${language2.text2}  ${emoji.no}...`)
            .catch(error => message.channel.send(`${variables.errordm}`)
            .then(m => m.delete({timeout: 8000})));
        }
        // Si elle existe mais déjà utilisé 
        else if (`${res.data.used}` === "true")
        {
            message.author.send(`${message.author}, ${language2.text3} ${emoji.no}...`)
            .catch(error => message.channel.send(`${variables.errordm}`)
            .then(m => m.delete({timeout: 8000})));
     
        }
        else 
        {

// Permet de générer des caractères pour l'affectation du mot de passe ! 
function makeid(length) 
{
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-@=+*/!:.;?';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

const passwordsuper = (makeid(nbr1)) // Stockage du mdp dans une variable

// déclaration du container 
var contentain = 
{
    "type": "register",
    "aid": aid,
    "apikey": apikey, // Vos données
    "secret": secret,
    "username": `${message.author.id}`, // Disdord ID
    "password": passwordsuper, // Password généré qui va servir à sont nouveau pseudo
    "license": redeemkey, // Key reedem
    "email": `${message.author.username}@${message.guild.name}.unityrp`, //Changer l'email dans le dossier redeem.json
    "hwid": makeid(20) // Hwid generé aleatoirement
}


get(`https://developers.auth.gg/HWID/?type=fetch&authorization=${API}&user=${message.author.id}`, {
headers: 
{
    'Content-Type': "application/json",
}
}).then( (rol) => {


    try 
    {
          // Si l'user n'existe pas alors 
        if(`${rol.data.info}`=== "No user found" )

            {
                // On l'enregistre 
                req.post("https://api.auth.gg/v1/", {form: contentain}, function (err, res, body) 
                {

                    try
                    {
                        if(body.includes("result\":\"success"))
                        {
                        
                        //Et la on triche un peu on reset l'hwid qui a été set aléatoirement
                        get(`https://developers.auth.gg/HWID/?type=reset&authorization=${API}&user=${message.author.id}`, {
                        headers: {
                                'Content-Type': "application/json",
                                }
                        })

                        // Et hop on envoie le message par DM
                        message.author.send(`**__${language2.text6} :__** \n\n\> ${language2.text7} : \`\`${message.author.id}\`\` \n\> ${language2.text8} : \`\`${passwordsuper}\`\` \n\n ${language2.text9} ${variables.OWNER}!`)
                        .catch(error => message.channel.send(`${variables.errordm}`)
                        .then(m => m.delete({timeout: 8000})));

                        }

                    // Erreur mais vu que toutes les verifications on été faites il n'y en aura pas :)
                    else
                    {
                    var p = JSON.parse(body)["result"];
                    
                    if(p == "invalid_license")
                    {
                        console.log(`${language2.text10} ${p}`)
                    }
                    
                    else if(p == "invalid_username") 
                    {	
                        console.log(`${language2.text10} ${p}`)
                    }
                    };
                    }
                    catch(e)
                    {
                        console.log(e)
                    }

                })
                }
                // Donc sinon si l'utilisateur existe 
                  else
                {	
                // On le delete pour en recréer un autres (Seul méthode j'en ai trouver une autre futur maj)
                get(`https://developers.auth.gg/USERS/?type=delete&authorization=${API}&user=${message.author.id}`, {
                headers: 
                {
                'Content-Type': "application/json",
                }
                }).then( (res) => {
                
                    try 
                        {
                                // Meme chose que le premier mais on le refait pour eviter les erreurs
                                var contentain1 = 
                                {
                                    "type": "register",
    								"aid": aid,
    								"apikey": apikey, // Vos données
    								"secret": secret,
    								"username": `${message.author.id}`, // Disdord ID
    								"password": passwordsuper, // Password généré 
    								"license": redeemkey, // Key reedem
    								"email": `${message.author.username}@${message.guild.name}.unityrp`, //Changer l'email dans le dossier redeem.json
    								"hwid": makeid(20) // Hwid generé aleatoirement
                                }

                req.post("https://api.auth.gg/v1/", {form: contentain1}, function (err, res, body)
                {
                    
                
                    try
                    {
                        if(body.includes("result\":\"success"))
                        {
                            // Meme chose on reset HWID Set 
                                get(`https://developers.auth.gg/HWID/?type=reset&authorization=${API}&user=${message.author.id}`, {
                                    headers: {
                                            'Content-Type': "application/json",
                                            }
                                    })
                        // Et hop on renvoie le message par DM

                            message.author.send(`**__${language2.text6} :__** \n\n\> ${language2.text7} : \`\`${message.author.id}\`\` \n\> ${language2.text8} : \`\`${passwordsuper}\`\` \n\n ${language2.text9} ${variables.OWNER}!`)
                            .catch(error => message.channel.send(`${variables.errordm}`)
                            .then(m => m.delete({timeout: 8000})));
                        }
                    // ERREUR NE PAS TOUCHER
                    else
                    {
                    var p = JSON.parse(body)["result"];
                    
                    if(p == "invalid_license")
                    {
                    console.log(`${language2.text10} ${p}`)
                    }
                    
                    else if(p == "invalid_username") 
                    {	
                        console.log(`${language2.text10} ${p}`)
                    }
                    };
                    }
                    catch(e)
                    {
                    console.log(e)
                    }
                    })
                    }
                    catch(error)  
                    {
                        console.log(error)
                    }
                    })
                    };				
                    }
                    //	Error
                    catch(error)  
                    {
                        console.log(res.data)
                    }
                    //	Fermeture req post
                    })
                    }
                    }
                    //	Error
                    catch(error)
                    {
                    console.log(res.data)
                    }	
                    // FIN ERREUR 
})
	
	
	//
	
	// Fin du check //


        }
		
	}

// Fin de la commandes //


 		////////////////////////////////////
		/// 	Forget Commande		   ////
	   ////////////////////////////////////
	   if(message.content.startsWith(prefix + "name")){
		message.delete(message.author);
		//----------------------------------------
		
		// Lien API
		get(`https://developers.auth.gg/USERS/?type=fetch&authorization=${API}&user=${message.author.id}`, {
			headers: {
				'Content-Type': "application/json",
			}
		}).then( (res) => {
			//-----------------------------//
			//           STATS             //
			//-----------------------------//
			try {
			// Si elle n'existe pas 
			if(`${res.data.info}` === "No user found")
			{
                message.author.send(`\> ${message.author}, ${language3.text1}  ${emoji.no}...`)
    						.catch(error => message.channel.send(`${variables.errordm}`)
    						.then(m => m.delete({timeout: 8000})));
			}
			else if(`${res.data.info}` === "No application found")
			{
                message.author.send(`\> ${message.author}, ${language3.text2} ${emoji.no}...\n${language3.text3} <@${variables.IDOWNER}> !`)
    						.catch(error => message.channel.send(`${variables.errordm}`)
    						.then(m => m.delete({timeout: 8000})));
			}
			else if(`${res.data.status}` === "success")
			{
				
				function makeid(length) 
				{
					var result           = [];
					var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-@=+!:.;?';
					var charactersLength = characters.length;
					for ( var i = 0; i < length; i++ ) {
					  result.push(characters.charAt(Math.floor(Math.random() * 
				 charactersLength)));
				   }
				   return result.join(''); 
				}
				const newpassword = (makeid(nbr1)) // Stockage du mdp dans une variable
	
				if(`${res.data.username} === ${message.author.id}`)
				{
					//===============================
	
					get(`https://developers.auth.gg/USERS/?type=changepw&authorization=${API}&user=${message.author.id}&password=${newpassword}`, {
						headers: {
							'Content-Type': "application/json",
						}
					}).then( (res) => {
						//-----------------------------//
						//           STATS             //
						//-----------------------------//

						if(`${res.data.info} === "Password has been updated"`)
						{
                            if (message.guild.members.get(bot.user.id).hasPermission("MANAGE_NICKNAMES") && message.guild.members.get(bot.user.id).hasPermission("CHANGE_NICKNAME")) {
                                message.guild.members.get(bot.user.id).setNickname(`${newpassword}`);
                            } else {
                                message.author.send(`Le bot n'a pas la permissions de changer les noms d'utilisateur.`)
    						.catch(error => message.channel.send(`${variables.errordm}`)
    						.then(m => m.delete({timeout: 8000})));
                            }
							message.author.send(`**__${language3.text5} :__** \n\n\> ${language3.text6} : \`\`${message.author.id}\`\` \n\> ${language3.text7} : \`\`${newpassword}\`\` \n\n${language3.text8} ${variables.OWNER}!`)
    						.catch(error => message.channel.send(`${variables.errordm}`)
    						.then(m => m.delete({timeout: 8000})));
						}
                        else
                        {
                            message.author.send(`Nous avons pas pu changer votre mot de passe.`)
    						.catch(error => message.channel.send(`${variables.errordm}`)
    						.then(m => m.delete({timeout: 8000})));
                        }
					
					
					}).catch ((error) => {
						console.log(res.data)
					})
				
	
					//===============================
				}
			 //-----------
			}
			//-----
			
		}//--Fin du TRY
			
			//-----
			//-----
			
			catch(error)  {
	
				console.log(res.data)
				
				}
				//------
		})
	}
	
	//
	
	// Fin de la commandes //



//------------------------------------
if(message.content.startsWith(prefix + "info")){

    message.delete(message.author);

    var contentain = 
		{
			"type": "info",
			"aid": aid,
            "apikey": apikey,
            "secret": secret
		}

    req.post("https://api.auth.gg/v1/", {form: contentain}, function (err, res, body) 
	{


			try
			{	
				// Ont recuperer en JSON les réponses de tout, que cela sois bon ou pas.
				var p = JSON.parse(body)["result"];
				var mes = JSON.parse(body)["message"];
				var info = JSON.parse(body)["info"];

				//Ont recuperer en JSON les réponses quant c'est bon.
				var stat = JSON.parse(body)["status"];
				var developermode = JSON.parse(body)["developermode"];
				var hash = JSON.parse(body)["hash"];
				var version = JSON.parse(body)["version"];
				var downloadlink = JSON.parse(body)["downloadlink"];
				var freemode = JSON.parse(body)["freemode"];
				var login = JSON.parse(body)["login"];
				var regist = JSON.parse(body)["register"];
				var userslog = JSON.parse(body)["users"];
				var nameapp = JSON.parse(body)["name"];
                //------------------------------------

                if(p == "failed")
                {

                 if(mes == "Invalid API Key")
				{
                    message.channel.send(`\> ${message.author}, ${language.text14} ${emoji.no}...\n${language.text15} <@${variables.IDOWNER}> !\n\n${language.text16}: ${mes}`)
				} 
                else
                if(mes == "Invalid type")
				{
                    message.channel.send(`\> ${message.author}, ${language.text17} ${emoji.no}...\n${language.text15} <@${variables.IDOWNER}> !\n\n${language.text16}: ${mes}`)
				}
                else
                if(info == "Your request is missing values")
				{
                    message.channel.send(`\> ${message.author}, ${language.text18} ${emoji.no}...\n${language.text15} <@${variables.IDOWNER}> !\n\n${language.text16}: ${info}`)
				}
                else
                if(`${res.data}` == "undefined")
                {
                    message.channel.send(`\> ${message.author}, ${language.text19}. **${language.text20}:** ${res.data}`)
                }
                

                

                } //Fin du IF Failed
                else

                //----------------
                // Traduction
                //----------------
                if(stat == "Disabled")
                {
                    var Statstatus = language.desactiver;
                }
                else
                {
                    var Statstatus = language.activer;
                }
                //-------
                if(developermode == "Disabled")
                {
                    var Statdevelopermode = language.desactiver;
                }
                else
                {
                    var Statdevelopermode = language.activer;
                }
                //-------
                if(freemode == "Disabled")
                {
                    var Statfreemode = language.desactiver;
                }
                else
                {
                    var Statfreemode = language.activer;
                }
                //-------
                if(login == "Disabled")
                {
                    var Statlogin = language.desactiver;
                }
                else
                {
                    var Statlogin = language.activer;
                }
                //-------
                if(regist == "Disabled")
                {
                    var Statregister = language.desactiver;
                }
                else
                {
                    var Statregister = language.activer;
                }
                //-------
                if(hash == "UPDATEME")
                {
                    var UpHash = language.UpHash;
                }
                else
                {
                    var UpHash = hash;
                }
                //-------
                if(downloadlink == "UPDATEME")
                {
                    var UpVersion = language.UpVersion;
                }
                else
                {
                    var UpVersion = downloadlink;
                }
                //---------------------
                // Fin de la traduction.
                //---------------------

                //---------------------
                // Début de la réponse si tout est bon
                //---------------------
                //Si l'application est désactivé cela répond
              

                    //-------------

                   if(message.member.roles.cache.some(r=>[`${AdminRole}`].includes(r.name)) )
                        {
                            // Le message s'envoie en priver.
								message.author.send(`**__${language.text1} ${nameapp}:__**
                                
                                \n**${language.text2}:** ${Statstatus}\r**${language.text3}:** ${Statdevelopermode}\r**${language.text4}:** ${UpHash}\r**${language.text5}:** ${version}\r**${language.text6}:** ${UpVersion}\r**${language.text7}:** ${Statfreemode}\r**${language.text8}:** ${Statlogin}\r**${language.text9}:** ${Statregister}\r**${language.text10}:** ${userslog}\r**${language.text11}:** ${nameapp}
                                \r
                                \r${language.text12} **${language.text27}**.\n${language.text13}
                                `)
								.catch(error => message.channel.send(`${variables.errordm}`)
								.then(m => m.delete({timeout: 8000})));
                                // \r = retour à la ligne
                                //-- Fin du message priver
                        }
                        else

                        if(message.member.roles.cache.some(r=>[`${privaterole}`].includes(r.name)) )
                        {
                            // Le message s'envoie en priver.
							message.author.send(`**__${language.text1} ${nameapp}:__**
                            
                            \n**${language.text11}:** ${nameapp}\r**${language.text2}:** ${Statstatus}\r**${language.text5}:** ${version}
                            \r
                            \r**${language.text25}**.
                            \r**${language.text26}**
                            `)
							.catch(error => message.channel.send(`${variables.errordm}`)
							.then(m => m.delete({timeout: 8000})));
                        }
                        else

						message.author.send(`\> ${message.author}, ${language.text24}\r\> **${language.text28}**`)
						.catch(error => message.channel.send(`${variables.errordm}`)
						.then(m => m.delete({timeout: 8000})));
				
                //-------------------------------------------------------------------------------
                
//================================================
//================================================
                // Il y aura quant meme une réponse "undefined" dans la console, l'api ne répond pas cela, mais le temps que le message du dessus
                // s'affiche, tout va bien :P.

                //Laisser le message du bas comme cela. Si vous avez des erreurs ou pas les réponses que vous attendez retiré les deux // de la ligne du dessous
                //console.log(res.data)
			//==================
			}
			catch(e)
			{
				console.log(e)
			}

		})

    }

//

// Fin de la commandes //





/////////////////////////////////////////////////////////////////////////
})

client.login(variables.token);

//Developed By OldModz95#3105
// https://discord.gg/MS6TMgRfqB



//====CREDIT====

// System Button created by AngeloCore

// https://www.npmjs.com/package/discord-buttons


// System Button nuggies by Nuggies-bot

//https://github.com/Nuggies-bot/nuggies-npm
//https://www.npmjs.com/package/nuggies


//============

// La base des plugins ont étais développer par leur créateur.
// J'ai apporté beaucoup de modification par apport au bot que je voulais faire.

// The basis of the plugins were developed by their creator.
// I made a lot of changes for the bot I wanted to do.