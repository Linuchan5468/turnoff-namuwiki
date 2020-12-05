
const full_settings = [
  document.getElementById('dbpia_proxy'),
  document.getElementById('blocked_url'),
  document.getElementById('intelliBan_url'),
  document.getElementById('banned_page_message'),
  document.getElementById('banned_page_retry'),
];


showVersion();

function createCheckbox(id: string, datasetVal: string, name: string) {
  const pTag = document.createElement("p");
  const labelTag = document.createElement("label");
  const inputTag = document.createElement("input");
  const spanTag = document.createElement("span");

  spanTag.classList.add("checkmark");

  inputTag.type = "checkbox";
  inputTag.id = id;
  inputTag.dataset.val = datasetVal;

  labelTag.innerHTML = name;
  labelTag.classList.add("container")
  labelTag.htmlFor = inputTag.id;
  labelTag.appendChild(inputTag);
  labelTag.appendChild(spanTag);

  pTag.appendChild(labelTag);

  return {
    p: pTag,
    input: inputTag
  };
}

(async () => {
//    try {
        config = await browser.storage.sync.get() as unknown as ConfigInterface;
        console.log(`로드 완료. ${JSON.stringify(config)}`);

        const groupsDiv = document.getElementById('blocked_groups');
        groupsDiv.innerHTML = "";
        for (const group of await loadBlockedGroups()) {
          const checkBoxData = createCheckbox("blocked_group_"+group, "blocked.group."+group, group);
          groupsDiv.appendChild(checkBoxData.p);
          
          if (!full_settings.includes(checkBoxData.input)) {
            full_settings.push(checkBoxData.input);
          }
        }

        const sitesDiv = document.getElementById('blocked_sites');
        sitesDiv.innerHTML = "";
        for (const site of await loadBlocked()) {
          const checkBoxData = createCheckbox("blocked_site_"+site.id, "blocked.site."+site.id, `${site.name ? site.name : site.baseURL} <span class="detail">${site.baseURL} - 그룹: ${site.group.length > 0 ? site.group.join(",") : "없음"}</span>`);
          sitesDiv.appendChild(checkBoxData.p);
          
          if (!full_settings.includes(checkBoxData.input)) {
            full_settings.push(checkBoxData.input);
          }
        }

        const redirectedDiv = document.getElementById('redirected_sites');
        redirectedDiv.innerHTML = "";
        for (const site of await loadRedirected()) {
          const checkBoxData = createCheckbox("redirected_"+site.id, "redirected."+site.id, `${site.name} <span class="detail">그룹: ${site.group.length > 0 ? site.group.join(",") : "없음"}</span>`);
          redirectedDiv.appendChild(checkBoxData.p);
          
          if (!full_settings.includes(checkBoxData.input)) {
            full_settings.push(checkBoxData.input);
          }
        }

        setHook(full_settings as HTMLInputElement[], (config) => {
          updateIntelliBan(config, (document.getElementById('intelliBan_url') as HTMLInputElement).value);
          updateBlocked(config, (document.getElementById('blocked_url') as HTMLInputElement).value);
        });
        /*
    } catch (e) {
        alert(e);
        console.error(e)
        console.error(`로드 실패. ${JSON.stringify(config)}`);
    }*/
})();
