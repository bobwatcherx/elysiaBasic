import {eden } from '@elysiajs/eden'
const client = eden("http://localhost:3000")


// for http://localhost:3000/
client.index.GET().then(console.log)


// FOR GUARD USE TOKEN
client.protect.GET({
	$query:{
		// YOU valid token
		token:12345
	}
}).then(console.log)


// FOR GET HEADERS REQUEST
client.myhead.GET({
	$fetch:{
		headers:{
			"mycert":"this value of mycert"
		}
	}
})

// POST REQUEST AND SEND YOU REQUEST BODY
client.mypost.POST({
	id:20,
	username:"my name is rahmat"
}).then(console.log)
