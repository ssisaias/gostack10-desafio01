const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
//Project example: { id: "1", title: 'Novo projeto', tasks: [] 
var totalReq = 0;
// middleware global
server.use((req,res,next)=>{
  console.time('Request');
  console.log(++totalReq);
  next();
  console.timeEnd('Request');
});

// middlewares locals
function checkProjectIsvalid(req,res, next){
  if(!req.body.id || !req.body.title){
    return res.status(400).json({error: 'Required fields missing'});
  }
  return next();
}

function checkProjectExists(req,res, next){
  const cProject = projects.find(proj => proj.id == req.params.id);
  // look for the project that matches the id
  if(!cProject){
    return res.status(404).json({error: 'Project not found'});
  }
  req.project = cProject
  return next();
}



server.get('/projects', (req,res) =>{
  res.json(projects);
})

server.post('/projects', checkProjectIsvalid, (req, res) =>{
  const project = req.body;
  projects.push(project);
  return res.status(200).send('OK');
});

server.put('/projects/:id', checkProjectExists, (req, res) =>{
  req.project.title = req.body.title;
  res.status(200).json(req.project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) =>{
  projects.splice(projects.indexOf(req.project),1);
  res.status(204).send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) =>{
  req.project.tasks.push(req.body.title);
  return res.status(200).send('OK');
});




server.listen(3000);