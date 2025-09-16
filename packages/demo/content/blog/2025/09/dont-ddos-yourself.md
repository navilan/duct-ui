---
title: "Don't DDoS yourself"
date: 2025-09-16
image: /blog/2025/09/ddos/effects.png
ogPath: /blog/2025/09/ddos/effects.png
author: navilan
tags: [Article, Philosophy]
---
This week cloudflare published a wonderful [retrospective][] on how their dashboard went down. It turned out to be an interesting case-study for [why duct's philosophy][philosophy] is timely and directionally sound.

[retrospective]: https://blog.cloudflare.com/deep-dive-into-cloudflares-sept-12-dashboard-and-api-outage/#what-happened
[philosophy]: /docs/why-duct

<!--more-->

> The API calls were managed by a React useEffect hook, but we mistakenly included a problematic object in its dependency array. Because this object was recreated on every state or prop change, React treated it as “always new,” causing the useEffect to re-run each time. - [Cloudflare Retrospective][retrospective]

![Direct and Transparent](/blog/2025/09/ddos/effects.png)

## The Problem with Hidden Dependencies

Here's how this bug happens in React - the dependency array silently triggers infinite re-renders:

```javascript
// React - Hidden dependency array bug
function Dashboard({ userId, filters }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchUserData(userId, filters).then(setData)
  }, [userId, filters]) // filters object recreated every render!
}

// Result: fetchUserData called on every render → self-DDoS
```

Compare this to Duct's explicit approach where effects are manually controlled:

```javascript
// Duct - Explicit effect management
function bind(el, eventEmitter, props) {
  let data = null
  let dataLoaded = false

  function loadData() {
    if (dataLoaded) return

    fetchUserData(props.userId, props.filters).then(result => {
      data = result
      dataLoaded = true
      updateDisplay()
    })
  }

  // Only call when you explicitly want to
  loadData()

  function release() {
    data = null
    dataLoaded = false
    // Data will be reloaded when component is rebound
  }

  return { loadData, release }
}
```

As AI-generated code becomes prevalent, these hidden dependency bugs will become commonplace unless we change our approach. We have two complementary paths forward.

* [Use a framework / library like duct][duct-blog-post] that emphasizes explicit code to ensure such effects are not hidden in plain sight and almost impossible to reason / spot.
* [Use an effect system library][effect] to make such effects not-hidden but transparent and easy to reason about with types.

[duct-blog-post]: /blog/2025/08/web-evolution
[effect]: https://effect.website

What is becoming clearer is the need to choose one of the above paths as we step into this new cycle. Cloudflare's outage is a reminder that implicit behavior in our tools can have real-world consequences.

The question isn't whether to embrace AI-generated code, but how to build systems that make dangerous patterns impossible to hide. Choose explicitness. Choose transparency. Choose tools that make your code's behavior obvious at first glance.
