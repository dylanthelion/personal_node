## My website

This is the source code for my website, viewable at http://www.dylanthelion.com. It's a code repository, for common and/or simple situations. Most importantly, the code snippets should be short and have few dimensions.

## Why this site?

I had to re-do my site some time back, when my MySQL driver broke, and decided to go with a nodejs app, to save myself some time. I also decided to eschew form posts. If you want to contribute, you'll have to do it here. Don't worry, I've made it as easy as I can. Finally, I chose to go with simple snippets, because finding tutorials is easy, whil finding a bit of code with the specific functionality I need is a more common problem, and often more difficult to solve.

## Installation

Clone the repo, install node, install gulp and n globally, then the latest stable node, if you haven't already. Then npm install. To actually run the app, you'll need a few more things:

    - a build dir with the following subdirs:
    	1. html/
    	10. styles/
    	11. js/
    	12. assets/

    - an environment dir with two files (see sampleVars.json for an example of what to place in these files):
    	1. devVars.json
    	2. prodVars.json

That should do it! I know that's a fair bit of work, but y'know, it's not a good idea to dump your environment into a git repo.

## Start the app

Build the app with the following commands (finish installation, first):

	- 'gulp clean'
	- 'gulp transform'
	- 'gulp build'

Finally, start the app with 'PORT=4040 NODE_ENV=dev node index.js'. You can alternatively use prod as your environment. You can also use whatever port you wish, though you'll need to alter your environment files, accordingly. If you do, change the corresponding lines in gulpfile.js (it's pre-build, so the environment doesn't exist).

## Contribute

Adding a snippet is pretty easy, once the app is running: 
	
	- Create a .ejs file in the public/whatever-language dir. You can copy the sample.ejs file in the root dir, or create a new file, and copy teh contents of sample.ejs.
	- Add a title. The title will be the name of your created link, so make it concise and descriptive.
	- Add a description to the empty p tag under the comment telling you to add a description
	- Add your code to the code tag. The gulp transform step will take care of special characters, but do keep in mind that the pre tag preserves whitespace and linebreaks, so keep your code pretty!
	- Follow the instructions under 'Start the app'. You should see a link for your new page in the index page for your chosen language.
	- Assuming everything works, push your branch to github and send me a PR. I'll check it out and add it as soon as I have time, and add you as a contributor.

## Contributors

These are the people who have contributed snippets, so far:

	- dylanthelion