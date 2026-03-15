Phase 1
    basic setup
    basic crud api

** Model: Listing **
    basic information
        . title --> string
        . description  --> string
        . image (link send) --> url
        . price   -- > number
        . location --> string
        . country  --> string

dataBase create 
    models folder me model ka schema hai or use export app.js

    init folder me data.js hai jisme array of data hai
        jise object ke rup me export kiya gaya hai
        index.js me mongoose  ka connection form kiya gaya or listing ko require kiya gaya hai
        ya par data ko add kiya gaya dataBase me ek baar run kar ke 
    
 ************ Styling code *****

    ** ejs-mate*** (common code jo har jagah hota hai)
 commman page jo har jaga dikhe to ejs-mate ka use karte hai
        npm i ejs-mate
        require
        app.engine("ejs",ejsMate)
        create folder layouts in view folder
        create basic.ejs
*** static file jo css or js serve karta hai *** 
    public folder ke under hona chahiye
    link css file into basic.ejs

bootstap  use for styling
    go bootstap.com
    link css into basic.ejs and js link 

*** create navBar using bootstap******

    ** includes folder in views folder *** (ye har page per use kar sakte hai ya change kar sakte hai)
        includes ke under code ke chote chote part honge 
            ex:- navBar , footer etc



 --> client side validations 
         jo bhi data frontend se form me bheja ja raha hai wo correct form me hona chahiye or correct hona chahiye

        **** form validations**** ( correct format)
            when we enter data in the form, the browser or the web server will check to see that the data is in the correct format and within the constraints set by the application
                --> required key word
                        ye form ko require bana deta jab tak nahi bharoge tab tak submit nahi hoga
                        alag alag browser oer ye different show hota hai esliye bootstap ka use karte hai
                --> success & failure message
                        use bootstap class 
                            class="valid-feedback"
                            class="invalid-feedback"
            
        --> server side validations (dataBase(schema) ya error handle)
                    dataBase base ke rule and koi data edit error ya add karte error aata hai uase handle 

                error handaling
                    agar koi price string enter kar deta hai to dataBase me string add hoga jo wrong hai server stop 
                    1. create utils folder
                        create wrapAsync function
                            try catch ko avoid karne ke liye wrapAsync function banate hai 
                    2. use middleware to handle error

            --> create custom  Express error handler
                  create ExpressError.js in utils
        
     ** Error.ejs **
            create error.ejs
                go bootstap alert
    
    *** validations for schema ***
        agar listing me koi field missing ho 
         jaise price, country jo error aata hai uase handled 

            install joi tool to handle the Schema error (server side Schema create karta hai)
                npm i joi 
                create schema.js 

***** creating review **
      1.  create review form in show page 
        2. submitting the form
            POST /listing/:id/reviews

        3. validations for reviews
            client side 
                use required kyeword and use bootstap class needs-validations
            
            server side validations
                1. joi schema banaya
                2. schema valitate function banaya  ( validateListing)
                3. pass as a middleware 
        
        delete reviews
            mongo $pull operator 
                --> the $pull operator remove from existing array all instance of a value or value that match a specified  condition.

        delete middleware for review
            agar listing delete hota hai to review bhi delete hona chahiye


*** Express Router **
 Express Router are a way to organize uour Express application such that our primary app.js file does not become bloated
    
    const router =express.Router() // create new router
    

*** Cookies** 
     Web Cookies
        HTTP Cookies are small blocks of data created by a web server while a user is browsing a  website and placed on the users computer or other device by the users web browser

    *** work of Cookies ** (to remember ki ham kis kis page per gaye hai)
            session management 
             personalization 
             tracking
    *** Send the Cookies ***
        
            app.get("/getcookies",(req,res)=>{
                res.cookie("greet","hello")
                res.send("greet hello")
            })

    *** Cookies parser *** (Cookies ko access or read karna)
            use cookie-parser middleware 
                install cookie-parser 
                const cookieParser=require("cookie-parser")
                app.use(cookieParser())

    *** Signed Cookies**** (joo bhi cookies bheja gaya hai uskesath kuchh change kiya gaya hai ki nahi)
           1 ** send the signed Cookies ***
                    app.use(cookieParser("secretcode"))
                    app.get("/getcookies",(req,res)=>{
                        res.cookie("name","niraj",{signed:true})
                        res.send("done")
                    })

            2. ** verify  signed Cookies ***
                    app.get("/verify",(req,res)=>{
                        // res.send(req.signedCookies)
                        console.log(req.signedCookies)
                        res.send("verify")
                    }) 

    ** what is State ? ***
            1. Stateful protocol
                    Statefull protocol require server to save the status and session information
                eg:- ftp (file transfer protocol)
            
            2. Stateless protocol 
                    Stateless protocol does not require the server to retain the server information
                eg:- http
        
       *** Express Sessions****  
            (server side per kuchh store karane ke liye npm package express-session install kar ke require and use karna hota hai)
            (ye ek middleware hota hai jisase sabhi req ka session Id store hota hai in the form of cookies)

            An attempt to make our session Stateful
                install 
                    npm i express-session
                        const session =require("express-session")
                        app.use(session({secret:"secretcode",resave:false, saveUninitialized:true}))
                        app.get("/session",(req,res)=>{
                            res.send("successful")
                        })
        
        ** remember session ***
                jitna exparies date hota hai utne din tak browser session id ko yaad rakhate hai

                const session =require("express-session")
                let sessionOptions ={
                    secret :"mysecretcode",
                    resave : false,
                    saveUninitialized: true,
                    cookie :{
                        expires:Date.now() + 7*24*60*60*1000, 
                        maxAge :7*24*60*60*1000,
                        httpOnly : true
                    }
                }
                app.use(session(sessionOptions))
    

    ** flash **
        to display the message 
        npm i connect-flash 


 *** Authentication ***
     Authentication is the process of verifying who someone is
     eg:- login ,signup

      Storing Passwords
        We NEVER store the Passwords as it is . we store their hashed form.

        Passwords ("hello")--> hashing function ----> how to stored("2165ewruhijkwef54we2t12werhjekjkr")

    *** Hashing function ***
        for every input,there is a fixed output
        They are one-way functions, we can not get input from output
        For a dufferent input , there is a different output but of same length
        small changes in input should bring large changes in output 
      eg;-MD5, CRC, bcrypt etc--> hashfunction
    
    *** Salting *** (Passwords ko or strong bana deta hai)
            salt ---> % ,?, @, # etc
        Passwords salting is a technique to protect Passwords stored in databases by adding a string of 32 or more  characters and then hashing them.
    
 *** Start Authentication using Passport ***
   1. passport instal process 
            step 1:
                npm i passport
            step 2: 
                 npm i passport-local (Passport strategy for authenticating with a username and password.)
                    (alag alag strategy hai passportjs.org per jisme se ham local wala use kar rahe hai )

            step 3: (agar mongo db use kar rahe hai to install karna hai)
                npm i passport-local-mongoose

    2.  user Model
            user :- username,email,password
            `User.plugin(passportLocalMongoose);` (ye plugin implement karta hai)
                passport-local-mongoose :- automaticaly username,hashing, salting and password define kar deta hai
    3. configuring strategy 
            `passort.initialize()`
                Amiddleware that initializes passport
            `passpost.session()`
                > A web appplication needs the ability to identify users as they browser from page to page. this series of requests and responses, each associated with the dame user, is known as a session
            ` passport.use(new LocalStrategy(User.authenticate()))`
            // use static serialize and deserialize of model for passport session support
            `passport.serializeUser(User.serializeUser());` 
            `passport.deserializeUser(User.deserializeUser());`




*** Authorization ***
   1. Authorization is the process of verifying what specific applications, files, and data a user has access to 

*** Uploading file ***
1.  in new listing create form we send the urlencoded data but now we send the `multipart/form-data` it help to uploade the image and send the file 
    2. in form i use `enctype="multipart/form-data"` 
   3.  when i create the listing then backend send empty object becuse the the backed don't understand the `"multipart/form-data"` so we use the `multer`. 
 4. `multer` library it is a node js middleware first we need to install `npm i multer`
        then require and create a multer fuction dest is the location where we store the image of listing
                `const multer  = require('multer')`
                `const upload = multer({ dest: 'uploads/' })`
        then use this middleware in code to send single file
                `upload.single('Listing[image]')`
        it store data in localy but we need to store parmanent the we use the third party storage `cloud aws drive etc `
    i use `cloud `
       1. go `cloudinary`
       2. create `.env file` to store variables / credentials --> sencetive thing do not share any platform and anyone and sotre in key value paire 
        eg:- SECRET=nirajkumar (sapce or koi bhi brecket, comma nahi likhana hai)
                do not aceess env variables directyl so install third party `dotenv`
                IF you are not in production I am in devlopment mode
                in `app.js`
                     if(process.env.NODE_ENV !="production"){
                     require('dotenv').config()
                     }
                in `.env file`
                    CLOUD_NAME=daaybnlkr
                    CLOUD_API_SECRET=rFOveeqQJQJfepWmWCetTxA1bOA
                    CLOUD_API_KEY=611223457714236
                After that 
                    Store files
                        `Multer store cloudinary`
                            install these third party library
                                `npm i cloudinary` and `npm i multer`

