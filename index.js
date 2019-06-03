const express = require('express');//returns a function
const app = express();//return express obj
app.use ( express.json());//not clear yet
const Joi =  require('joi');//to validate input
const fs =  require ('fs');//to work with files

// see more : https://expressjs.com/en/api.html#req

//courses array
var courses = [
{id:1, name:'course1'},
{id:2, name:'course2'},
{id:3, name:'course3'},
{id:4, name:'course4'}
]




//when homepage ('/') is "get" requested - say hello
app.get('/', (req,res)=>
{
 res.send('Hello World!!!');
});

//route to get all courses
app.get('/api/courses', (req,res)=>
{
 res.send ([1,2,3,4]);
});


//route to get  a single course by id
//':courseID' = request parameter
//req.params.courseID;//access parameter
//see more : request param object  and query string parameter
// https://youtu.be/pKd0Rpw7O48?list=LLY9rWFu_rN6-4DAjYyLXqqQ&t=1278
app.get('/api/courses/:courseID', (req,res)=>
{
    //look for the course with given id:
    const course = courses.find(c => c.id === parseInt(req.params.courseID));
    if(!course)
    {
        res.status(404).send(`Course ${req.params.courseID} does not exist`);
        return;
    }

    res.send(course); 
});


//handle http post request to create a new course inside the server
app.post('/api/courses', (req,res)=>
{
  const result = validateCourse(req.body);
  if(result.error)
  {
      res.status(400).send(result.error.message);
      return;
  }

    const course =//creating course accordin to request
    {
        id: courses.length+1,
        name: req.body.name //assuming 'body.name' axists in the reqest body
        //for this line to work --> need to enable parsing a jason object
        //see line :  "app.use ( express.json());"
    }
    //Adding course  to server belly
    courses.push(course);
    console.log(courses.length);
    res.send(course);
});


//route to update an existing course & if does not exist return error
app.put('/api/courses/:id',(req,res) =>
{
    //look for the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)
    {
        res.status(404).send(`Course ${req.params.id} does not exist`);
        return;
    }
    //validate request's course
    const result = validateCourse(req.body);
    if(result.error)
    {
        res.status(400).send(result.error.message);
        return;
    }

    //else :
    course.name = req.body.name;
    res.send(course);
});

//************************************************ Functions *************************************/

//***************    read and write json internal file    ***************//
function WriteCoursesToJsonFile ( courses,filename)
{
    var  JsonArr =  JSON.stringify(courses );
    fs.writeFileSync(filename,JsonArr,'utf8',() =>{});
}

function ReadCoursesFromJsonFile(filename)
{
    var str = fs.readFileSync(filename, 'utf-8');     
    return JSON.parse(str);
}

//WriteCoursesToJsonFile(courses , './courses.json');
//var blyat = ReadCoursesFromJsonFile('./courses.json');



//***************course validation from request***************//
function validateCourse (course)
{
    const schema = //validating request with joi module
    {
        name:Joi.string().min(3).required(),
    }
  return Joi.validate(course,schema); 
}

app.on('close', function() {
    console.log(' Stopping ...');
  });

process.on('SIGTERM', function() {
    server.on('close',function() {
        console.log(' Stopping ...');
      })
});



//when deploying the app, port number may vary between
//hosts environments, so:
const port  =  process.env.PORT || 3000
 var server = app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
    courses =  ReadCoursesFromJsonFile('./courses.json');
    //console.log(courses);
});