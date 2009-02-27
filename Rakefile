require 'rake'
require 'vlad'
require 'vlad/git'

set :domain, "nex-3.com"
set :deploy_to, "/home/nex3/pi"
set :repository, "git://github.com/nex3/pi.git"

namespace :vlad do
  desc "Prepares application servers for deployment.".cleanup
  remote_task :setup, :roles => :app do
    dirs = [deploy_to, releases_path, scm_path, shared_path]
    dirs += %w(system log pids).map { |d| File.join(shared_path, d) }
    run "umask 02 && mkdir -p #{dirs.join(' ')}"
  end

  desc "Updates the server to the latest revision."
  remote_task :update, :roles => :app do
    run ["cd #{scm_path}",
      "#{source.checkout revision, '.'}",
      "#{source.export ".", release_path}",
      "chmod -R g+w #{latest_release}",
      "staticmatic build #{latest_release}",
    ].join(" && ")

    run "rm -f #{current_path} && ln -s #{latest_release} #{current_path}"
  end
end

desc "Preview the site on localhost:3000"
task(:preview) {sh 'staticmatic preview .'}
desc "Build the static HTML and CSS for the site"
task(:build) {sh 'staticmatic build .'}
