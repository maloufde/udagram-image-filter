# Short Notes on Cloud Developer Project 2 Assignment

## Setup Project on Github
* create Github project maloufde/udagram-image-filter
* initialize with README and .gitignore
* create branch development
* Github > Settings > Branches > Add rule > Force Pull requests for master

## Development Start 
* initialize with starter code
* npm install and tryout basic server
* commit to development, create PR and merge into master branch

## Implement Feature
* see `server.ts`

## (Optional) add convenience build-scripts for Windows OS
* **npm run winbuild** - clean and build folder _www_ with _Archive.zip_
* npm run winclean - removes build dir on windows, used by _winbuild_
* npm run winzip - zip build dir with **7zip** , used by _winbuild_

## Build deployment (Archive.zip)
* on **Linux**/MacOS etc.: `npm run build`
* (optional) on **Windows** with **7zip** installed: `npm run winbuild`

## Init Elastic Beanstalk 
With `eb init udagram-image-filter` and answering some questions
we'll get `.elasticbeanstalk\config.yml`:
 
```
branch-defaults:
  default:
    environment: udagram-image-filter-dev
    group_suffix: null
deploy:
  artifact: ./www/Archive.zip
global:
  application_name: udagram-image-filter
  branch: null
  default_ec2_keyname: udacity-cdnd-keypair
  default_platform: Node.js
  default_region: us-east-1
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: null
  repository: null
  sc: null
  workspace_type: Application
```  

## Create EB environment
```
eb create
# Enter Environment Name: udagram-image-filter-dev
# Enter DNS CNAME prefix: udagram-image-filter-dev
# Load Balancer: application
```

## Redeploy Application Archive.zip
```
eb deploy
```
 
## Bind application to my own registered domain (with registrar other than AWS)
* Registrar (strato.de): create subdomain _**udagram**.christian-malouf.de_
* AWS Route 53: create Hosted zone
  * Domain name: udagram.christian-malouf.de
  * Typ: public
  * Comment: Udagram Services
  * **Create** and then ...
  * ... make a note of the 4 nameserver entries
* Registrar: Edit NS-record and enter nameserver addresses
* AWS Route 53: Add an A-record for the service, e.g.
  * Name: imagefilter.udagram.christian-malouf.de
  * Typ: A
  * Alias: e.g. _udagram-image-filter-dev22.us-east-1.elasticbeanstalk.com_ or Loadbalancer from Dropdown
  * Target integrity: No (default)
