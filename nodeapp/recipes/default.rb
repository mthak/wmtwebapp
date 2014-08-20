#
# Cookbook Name:: nodeapp
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
source_url="https://app.box.com/s/8by7limu1upks8pcsbxo"
remote_file "/app/repo/#{node[:app][:name]}.tar" do
  source "#{node['source_url']}"
  mode 0777
  owner "root"
  group "root"
  action :create
end

node['webapp_deploy'].each do |base_name|
Chef::Log.info "Found correct value for my service   #{base_name} "
directory "/app/#{base_name}" do
  owner "root"
  group "root"
  mode 0755
  action :create
notifies :run, "bash[inst_node_#{base_name}]", :immediately
end


bash "inst_node_#{base_name}" do
   code <<-EOS
  set -e -v
   pwd
   echo "base name is #{base_name}"
   cd /app/#{base_name}
   tar -xvf /app/repo/#{node[:app][:name]}.tar
   cd  #{node[:app][:name]}
   npm install
  sleep 5
  echo `pwd`
   watch -n 2 nohup /usr/bin/nodejs app.js & 
   sleep 10
   EOS
notifies :run, "bash[smoke_test_#{base_name}]", :immediately
 end

 bash "smoke_test_#{base_name}" do
code <<-EOS
set -e -x
pwd
url=http://localhost:3000/catalog/cataloglist
statuscode=`curl -s -I $url |grep 'HTTP' | awk '{print $2}'`

    case $statuscode in
    200)
        echo "tested url $url "
        echo -ne "recevied \t $statuscode for #{base_name}"
	echo "The SMOKE TEST PASS APPLICATION LOOKS GOOD ALL OK"
	;;
    500)
       echo "tested url $url "
        echo -ne "\t recieved $statuscode for #{base_name}"
	echo "The SMOKE test FAILED STATUS CODE $statuscode -- #{base_name} --APPLICATION IS NOT AVAILABLE MAY BE TOMACT DID NOT START OR IS NOT RUNNING check tomcat  LOGS"
        exit 1;;
    404)
        echo "tested url $url "
        echo -ne "\t recieved $statuscode for #{base_name}"
        echo "The SMOKE test FAILED STATUS CODE $statuscode -- #{base_name} --APPLICATION IS NOT AVAILABLE CHECK DATABASE CONNECTION MAY BE A DATABASE ISSUE  check tomcat  LOGS"
        exit 1
        ;;
     *)
       echo "tested url $url "
        echo -ne "\t  recieved $statuscode for #{base_name}"
	echo "The SMOKE test FAILED APPLICATION $statuscode -- #{base_name} IS NOT ABLE TO CONNECT TO DATABSE MOST PROBABLY Please chec app LOGS"
        exit 1
        ;;
    esac
 EOS
end
end
