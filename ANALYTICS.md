# CASTOR access analytics

Status: prepared, disabled until a verified owner-controlled GA4 measurement ID is supplied.

Set `measurement_id` in analytics-config.json to the ID for a web stream owned by CASTOR. All three sites read this same configuration. View private reports at https://analytics.google.com/. Configure custom dimension `castor_site` if per-site event reports are wanted; page paths also distinguish sites. Set property timezone to Asia/Tokyo.

Events: page_view (all pages), game_open (game page loaded), game_start (actual accepted start of a game). Counts are browser-based estimates, not identified people. Do not add counts across sites to derive unique people. No player, save or answer data is sent. Query strings and fragments are removed. Analytics failure does not affect games. Consent/legal requirements should be assessed for the intended deployment and audience before activation.

Family exclusion: open each site with `?analytics-exclude=1` in the same browser or installed PWA used for playing. `?analytics-exclude=0` restores collection. This writes only castor_analytics_excluded_v1, never game storage. Browser GPC or DNT also disables collection. Installed apps may have separate storage; exclusion must be applied in that context.

Past visits cannot be reconstructed. Realtime receipt and private report access must be verified after activation; preparation alone does not establish data collection.
