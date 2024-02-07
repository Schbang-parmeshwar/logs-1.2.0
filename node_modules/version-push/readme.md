## Version Pusher

1. This is used to push command to the respective branch
2. Also is used to maintain the semantic versioning

<br />


### step 1 :  add this inside package.json 
```js
"scripts": {
"push": "node ./node_modules/version-push"
}
```

###  step 2 : then you can add this command in terminal to run the command
```js
npm run push
```