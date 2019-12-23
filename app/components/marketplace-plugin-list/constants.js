export default {
    instructions: `
    <ul class="bullet-list margin-r-1 margin-l-1h">
      <li class="margin-b-1">
        Generate a personal access token from <a href="/settings/developersettings" target="_blank">Developer Settings</a>
      </li>
      <li class="margin-b-1">
        Set environment variable <code class="black-text">APPKNOX_ACCESS_TOKEN</code> with the personal token:<br>
<pre class="code-block">
$ export APPKNOX_ACCESS_TOKEN=&lt;personal access token&gt;
</pre>
      </li>
      <li class="margin-b-1">
        Download the appknox binary:<br>
<pre class="code-block">
$ curl -L https://github.com/appknox/appknox-go/releases/download/1.0.1/appknox-\`uname -s\`-x86_64 &gt; /usr/local/bin/appknox && chmod +x /usr/local/bin/appknox
</pre>
      </li>
      <li class="margin-b-1">
        Upload the app file to Appknox platform for scanning:<br>
<pre class="code-block">
$ appknox upload &lt;path to apk/ipa file&gt;
</pre>
      </li>
      <li class="margin-b-1">
        Check if the automated scanner detected any vulnerability above (or equal to) the specified risk level:<br>
<pre class="code-block">
$ appknox cicheck &lt;file-id&gt; --risk_threshold &lt;low|medium|high|critical&gt;
</pre>
      </li>
      <li class="margin-b-2">
        Tip: You can combine the upload and cicheck command as below which will list down all the vulnerabilities equal to or above the specified risk threshold and will exit with an error status.<br>
<pre class="code-block">
$ appknox upload &lt;path to apk/ipa file&gt; | xargs appknox cicheck --risk-threshold &lt;low|medium|high|critical&gt;
</pre>
      </li>
    </ul>
  `,
appCenterInstructions:`
  <ol class="margin-r-1 margin-l-1h">
    <li class="margin-b-1">
      Generate a personal access token from <a href="/settings/developersettings" target="_blank">Developer Settings</a>
    </li>
    <li class="margin-b-1">
      Create a file <code class="black-text"><strong>appcenter-post-build.sh</strong></code> in your source code repository as per the <a href="https://docs.microsoft.com/en-us/appcenter/build/custom/scripts/#post-build" target="_blank">build docs</a> and add the content given below:
      <pre class="code-block">
if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then
  if [ "$APPCENTER_BRANCH" == "master" ];
    then
        curl -L https://github.com/appknox/appknox-go/releases/download/1.1.0/appknox-\`uname -s\`-x86_64 > appknox && chmod +x appknox
        ./appknox upload $APPCENTER_OUTPUT_DIRECTORY/&lt;binary_file_name&gt;
        rm appknox
  else
      echo "Current branch is $APPCENTER_BRANCH"
  fi
fi</pre>
      <small><code class="black-text">binary_file_name</code> is the app bundle file (.apk for Android, .ipa for iOS)</small>
    </li>
    <li class="margin-b-1">
    Once the file has been added to repo, in App Center goto <strong>Build Configuration > Build > Build scripts</strong> and verify <strong>Post-build</strong> is marked.
      <img  class="margin-t-1" src="images/appcenter_build_configuration__build_script.png" alt="appcenter build config"/>
    </li>
    <li class="margin-b-1">
      Go to <strong>Build Configuration > Environment variables</strong> and add <code class="black-text"><strong>APPKNOX_ACCESS_TOKEN</strong></code> environment variable with the value generated in step 1.
      <img class="margin-t-1" src="images/appcenter_build_configuration__environment.png" alt="appcenter environment config"/>
     </li>
  </ol>
`

}
