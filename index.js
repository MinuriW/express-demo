const Joi = require('joi'); //replacing validation logic with joi
const express = require('express');
const app = express();

app.use(express.json()); //method returns an express middleware that is used by the app.use to the request processing

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
];
app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error)
        // res.status(400).send(error.details[0].message);
        // return;
        return res.status(400).send(error.details[0].message);

    // const schema = {
    //     name: Joi.string().min(3).required()
    // };
    //
    // const result = Joi.validate(req.body, schema);
    // if(result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    // console.log(result);


    // if (!req.body.name || req.body.name.length < 3){
    //     //400 Bad Request
    //     res.status(400).send('Name is required and should be minimum 3 characters.');
    //     return;
    // }

   const course = {
       id: courses.length + 1,
       name: req.body.name //need to enable parsing of json objects in the request body hence use app.use()
   };
    courses.push(courses); //push to array
    res.send(course); //when we push an obj to the server, when the server created a new resource/obj we should return that obj in the body response
});



app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given ID was not found');
    res.send(course);
});

// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.query); //http://localhost:3000/api/posts/2018/1?sortBy=name
//     //res.send(req.params); //http://localhost:3000/api/posts/2018/1
// });


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));//Look up the course
    if (!course) return res.status(404).send('The course with given ID was not found');  // If not existing, return 404

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); //error =result.error
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;//Update course
    res.send(course);//Return the updated course to the client
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}


app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));//Look up the course
    if(!course) return res.status(404).send('The course with given ID was not found');// If not existing, return 404

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});
