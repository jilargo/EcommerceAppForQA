# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Welcome Back" [level=2] [ref=e3]
  - paragraph [ref=e4]: Login to your Eyan Food Cafe account
  - generic [ref=e5]: Invalid email or password
  - generic [ref=e6]:
    - textbox "Email" [ref=e8]: ian@example.com
    - generic [ref=e9]:
      - textbox "Password" [ref=e10]: "!Password123"
      - generic [ref=e12] [cursor=pointer]: 
    - button "Login" [active] [ref=e13] [cursor=pointer]
  - link "Don’t have an account? Sign up" [ref=e14] [cursor=pointer]:
    - /url: signup.html
```